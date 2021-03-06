import { mapMutations } from 'vuex'
import { worker } from 'api/worker'
import { host, report } from 'config/index'
import { request, setStore, getStore, createHexRandom, getOperationFullTime } from 'utils/index'
import PlayerConstructor from 'byted-toutiao-player'
import weixin from '../weixin/index'
import withApp from '../withApp/index'
import ua from '../ua/index'
import wx from '../../static/js/weixin_jssdk'
require('../report/index')

const infoc = window.Infoc? window.Infoc.b(report.key, report.name) : null

export default {
	...mapMutations(['SET_COMPONENT', 'SET_VIDEO_ID']),

	setComponent (component) {
		this.SET_COMPONENT({component: component})
	},

	setVideoId (videoId = '') {
		this.SET_VIDEO_ID({videoId: videoId})
	},

	fetch (url = '', data = {}, type = 'GET', method = 'fetch') {
		return worker.work(url, data, type, method)
	},

	getPlayer (criteria) {
		return new PlayerConstructor(criteria)
	},

	initWeixin (data) {
		weixin.init(data)
	},

	isIOS () {
		return ua.os.ios
	},

	getId (type) {
		let key = '',
			id = '',
			bit = 0
		switch (type) {
			case 'uuid':
				key = 'GAME_MASTER_UUID'
				bit = 32
				break;
			case 'aid':
				key = 'GAME_MASTER_AID'
				bit = 16
				break;
		}
		id = getStore(key)
		id == '' && (id = createHexRandom(bit), setStore(key, id))
		return id
	},

	activate (criteria = {}) {
		if (ua.os.ios) {
			new withApp.downloadApp(criteria)
		} else {
			if (ua.browser.qqbrowser) {
				// QQ浏览器
				// 根据时间戳判断用户是否安装了app，若安装了app，将直接打开app，下载逻辑将不执行
				const loadDateTime = new Date();
				setTimeout( () => {
					const timeOutDateTime = new Date();
					if (!loadDateTime || timeOutDateTime - loadDateTime < 510) {
						new withApp.downloadApp(criteria)
					}
				}, 500)
				new withApp.wakeUpApp(criteria)
			} else {
				new withApp.wakeUpApp(criteria)
				new withApp.downloadApp(criteria)
			}
		}
	},

	getNetwork () {
		if (ua.browser.weixin) {
			return new Promise(resolve => {
				setTimeout( () => {
					wx.getNetworkType({
						success: function (res) {
							resolve(res.networkType)
						}
					})
				}, 100)
			})
		} else {
			const connection = (typeof navigator !== 'undefined' && navigator.connection) || null
			return connection&&connection.effectiveType? connection.effectiveType:''
		}
	},

	getNetworkType (cate) {
		let type = 32
		switch (cate) {
			case 'wifi':
				type = 3
				break;
			case '4g':
				type = 16
				break;
			case '2g':
				type = 4
				break;
			case  '3g':
				type = 8
				break;
			case  'ethernet':
				type = 2
				break;
			case  'none':
				type = 64
				break;
			case  'default':
				type = 26
				break;
		}
		return type
	},

	getSource () {
		const key = 'from',
			value = request(key)
		let ret = 0
		switch (value) {
			//朋友圈
			case 'timeline':
				ret = 2
				break;
			//微信群
			case 'groupmessage':
				ret = 5
				break;
			//QQ好友
			// case '':
			// 	ret = 3
			// 	break;
			// //QQ控件
			// case '':
			// 	ret = 4
			// 	break;
			//好友分享(包括QQ，微信)
			case 'singlemessage':
				ret = 1
				break;
		}
		return value
	},

	async report (criteria) {
		if(!infoc) return
		const cate = await this.getNetwork(),
			network = this.getNetworkType(cate)
		const system = ua.os.ios? 2 : (ua.os.android? 1 : 3),
			source = this.getSource(),
			uptime = Date.parse(new Date(getOperationFullTime(new Date())))/1000,
			download = 0,
			obj = {
				system: system,
				source: source,
				download: download,
				network: network || 32,
				uptime2: uptime
			}
		_.assignIn(obj, criteria)
		infoc.report(obj)
	}
}