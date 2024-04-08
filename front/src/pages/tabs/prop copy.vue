<!--
 * @Author: dary
 * @Date: 2021-03-05 17:37:34
 * @LastEditors: dary
 * @LastEditTime: 2021-03-09 11:42:19
 * @Description: file content
-->

<template>
	<view class="prop-wrap">
		<u-navbar title="宝物大全" :is-back="false" title-color="#fff" :background="{'backgroundColor': '#26a2ff'}" back-icon-color="#fff"></u-navbar>
		<view class="content-outer">
			<view class="content-wrap">
				<div v-html="content"></div>
			</view>
		</view>
	</view>
</template>

<script>
	import prop from "@/common/json/prop.json";
	export default {
		name: 'ServiceCenter',
		data() {
			return {
				content: "",
				list: []
			}
		},
		computed: {

		},
		onLoad() {
			let content = prop[0]['正文'];
			content = content.replace(/bgcolor="#292929"/g, "").replace(/http:/g, 'https:');
			this.content = content;
			let arr = content.match(/src="(.*?)"/g);
			arr = arr.map(item => item.slice(5, -1));
			// this.$nextTick().then(() => {
			// 	let trs = document.getElementsByTagName("tr");
			// 	for (let index = 0; index < trs.length; index++) {
			// 		const tr = trs[index];
			// 		if (index < 2) {
			// 			tr.remove();
			// 		}
			// 		if (index === 2) {
			// 			tr.children[0].innerHTML = "0级";
			// 		}
			// 	}
			// });
		},
		onShow() {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.prop-wrap {
		display: block;
		::v-deep table {
			max-width: 100% !important;
			width: auto !important;
			margin: -25px 0 -150px !important;
			td {
				padding: 5px 0;
			}
			img {
				width: 64px;
				height: 64px;
				margin-right: 10px;
			}
			table {
				display: none;
			}
		}
		.content-outer {
			padding-bottom: 0;
		}
	}
</style>