<template>
	<div class="video-header">
		<div class="info">
			<div class="title">
				<span>{{title | clip(62)}}</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'VVideoHeader',
		props: {
			title: {
				type: String
			}
		},
	}
</script>

<style lang="stylus">
	.video-header
		height 2.19rem
		font-size .5rem
		color #333
		background #fff
		box-shadow 0 .14rem .33rem 0 rgba(0,0,0,0.05)
		.info
			padding .4rem .69rem .4rem .69rem
			.title
				span
					display -webkit-box
					display box
					overflow hidden
					text-overflow ellipsis
					-webkit-line-clamp 2
					-webkit-box-orient vertical
					letter-spacing 0
					line-height .67rem
</style>
