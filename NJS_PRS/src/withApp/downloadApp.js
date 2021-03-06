import ua from '../ua/index'
import { app } from 'config/index'

export default class downloadApp {

	vm = null

	constructor (criteria) {
		this.vm = criteria
		if (this.vm.skipDownload) return
		this.init()
	}

	init () {
		if (ua.os.android) { //Android
			if (ua.browser.weixin || ua.browser.qqbrowser) {
				this.goMyapp(app.gm)
			} else { // 安卓 非微信 调起应用宝
				this.goMyappDownload()
			}
		} else {
			this.goMyapp(app.gm)
		}
	}

	goMyapp (url) {
		// setTimeout( () => {
			location.href = url
		// }, 2* 1000)
	}

	//唤醒应用宝app
	goMyappDownload () {
		// this.removeIframe()
		setTimeout( () => {
			const ele = this.getIframe()
			window.document.body.appendChild(ele)
			setTimeout( () => {
				window.document.getElementById('app_dl_iframe').remove()
				location.href = this.beforeAppDownload()
			}, 1500)
		}, 100)
	}

	getIframe () {
		let ele = window.document.createElement('iframe')
		ele.id = 'app_dl_iframe'
		ele.src = app.myapp
		ele.style.display = 'none'
		return ele
	}

	removeIframe () {
		const iframe = window.document.getElementById('app_dl_iframe')
		iframe && window.document.body.removeChild(iframe)
	}

	beforeAppDownload () {
		return app.downloadLink
	}
}