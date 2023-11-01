<!--
 * @Author: dary
 * @Date: 2021-03-05 17:37:34
 * @LastEditors: dary
 * @LastEditTime: 2021-03-09 14:41:10
 * @Description: file content
-->

<template>
	<view class="customer-services">
		<u-navbar back-icon-name="more-dot-fill" title="野外生物" :custom-back="togglePopup" title-color="#fff" :background="{'backgroundColor': '#26a2ff'}" back-icon-color="#fff"></u-navbar>
		<view class="content-outer">
			<u-popup v-model="popupVisible" mode="left">
				<uni-list class="btns-wrap">
					<uni-list-item @click="getContent(item)" v-for="(item, index) in list" :key="index" :title="item[0]" :class="current[0]===item[0]?'active':''" clickable showArrow></uni-list-item>
				</uni-list>
			</u-popup>
			<view class="content-wrap">
				<h2>{{current[0]}}</h2>
				<view v-html="current[1]&&current[1].replace(/http:/g, 'https:')"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import creeps from "@/common/json/creeps.json";

	export default {
		name: 'ServiceCenter',
		data() {
			return {
				popupVisible: false,
				list: [],
				current: []
			}
		},
		computed: {

		},
		onLoad() {
			var data = creeps.map(item => Object.values(item))
			this.list = data.filter(
				item => item.length === 2 && item[1].length > 150
			);
			this.getContent(this.list[0]);
		},
		onShow() {

		},
		methods: {
			togglePopup() {
				this.popupVisible = !this.popupVisible;
			},
			getContent(item) {
				// document.querySelector(".content-wrap").scrollTo(0, 0);
				this.current = item;
				this.popupVisible = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.btns-wrap {
		// #ifdef APP-PLUS
		margin-top: 80px;
		// #endif
	}
</style>