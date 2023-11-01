<script>
	export default {
		onLaunch: function () {
			console.log('App Launch')
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		},
	}
</script>

<style lang="scss">
	@import "@/common/css/base.scss"; // 基础样式
	@import "@/uni_modules/uni-scss/index.scss";
	@import "@/uni_modules/vk-uview-ui/index.scss";

	.content-outer {
		padding: 10px 10px 70px;
		background: #fff;
	}

	.content-wrap {
		word-break: break-all;
		font-size: 26rpx !important;
		table {
			border-collapse: collapse;
			font-size: 26rpx !important;
		}
		h2 {
			text-align: center;
			margin-bottom: 10px;
		}
	}
	::v-deep .uni-tag {
		font-weight: 400 !important;
	}

	.flex-1 {
		flex: 1;
	}

	.space-x-10 > :not([hidden]) ~ :not([hidden]) {
		--tw-space-x-reverse: 0;
		margin-right: calc(10px * var(--tw-space-x-reverse));
		margin-left: calc(10px * calc(1 - var(--tw-space-x-reverse)));
	}
	/*每个页面公共css */
</style>
