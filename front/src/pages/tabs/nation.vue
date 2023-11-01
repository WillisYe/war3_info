<!--
 * @Author: dary
 * @Date: 2021-03-05 17:37:34
 * @LastEditors: dary
 * @LastEditTime: 2021-03-09 15:15:16
 * @Description: file content
-->

<template>
	<view class="customer-services">
		<u-navbar title="种族资料" title-color="#fff" :background="{'backgroundColor': '#26a2ff'}" :is-back="false"></u-navbar>

		<view class="content-outer">
			<view class="">
				<u-tabs :list="tabs" :is-scroll="false" :current="index" @change="handleChange"></u-tabs>
			</view>
			<view class="content-wrap">
				<view class="unit-list">
					<view @click="changeUnit(index)" :class="current.index===index?'active':''" class="unit-item" v-for="(item,index) in current.list" :key="item.name">{{item.name}}</view>
				</view>
				<view v-html="current.html&&current.html.replace(/http:/g, 'https:')"></view>
			</view>
		</view>
	</view>
</template>

<script>
import heroData from "@/common/json/heroData.json";
import unitData from "@/common/json/unitData.json";

export default {
	name: 'ServiceCenter',
	data() {
		return {
			tabs: [
				{ name: '人族', key: 'hum' },
				{ name: '暗夜', key: 'ne' },
				{ name: '兽族', key: 'orc' },
				{ name: '不死', key: 'ud' },
				{ name: '中立', key: 'zl' },
			],
			index: 0,
			nation: "",
			hum: [],
			ne: [],
			orc: [],
			ud: [],
			zl: [],
			current: {
				nation: "",
				list: [],
				html: "",
				index: 0
			},
		}
	},
	computed: {

	},
	onLoad() {
		let self = this;
		if (unitData) {
			let data = unitData;
			let list = self.getList(data);
			self.hum = list.filter(item => ["人类", "人族"].includes(item.nation));
			self.ne = list.filter(item => item.nation === "暗夜");
			self.orc = list.filter(item => item.nation === "兽族");
			self.ud = list.filter(item => item.nation === "不死");
			self.changeNation("hum");
		}
		if (heroData) {
			let data = heroData;
			data = data.filter(item => item[0].includes("中立"));
			self.zl = data.map(item => ({
				name: item[0].slice(6),
				html: "<br>" + item[1],
				type: "hero",
				nation: "zl"
			}));
		}
	},
	onShow() {

	},
	methods: {
		handleChange(index) {
			this.index = index;
			var selected = this.tabs[index].key;
			this.changeNation(selected);
		},
		getList(data) {
			data = data.map(item => item[0]);
			data = data.filter(item => item.length > 10);
			data = data.map(item => {
				let arr = item.split("</table>");
				arr = arr.slice(1);
				let [name, html] = [this.getName(arr[0]), arr.join("</table>")];
				if (name.includes("：")) {
					this.nation = name.slice(0, 2);
					name = name.slice(3);
				}
				return {
					name,
					html,
					type: name.includes("：") ? "hero" : "unit",
					nation: this.nation
				};
			});
			return data;
		},
		getName(html) {
			let temp = html.match(/<td([\S\s]*?)<\/td>/g);
			let name = temp[2] || temp[0];
			name = name.replace(/<([\S\s]*?)>/g, "");
			name = name.replace(/\s*/g, "");
			name = name.replace(/[\(（].*[\)）]/, "");
			return name == "状态" ? "破法" : name;
		},
		changeNation(nation) {
			// document.querySelector(".content-wrap").scrollTo(0, 0);
			this.current.list = this[nation];
			this.current.nation = nation;
			this.changeUnit(0);
		},
		changeUnit(index) {
			this.current.html = this.current.list[index].html;
			this.current.index = index;
		}
	}
}
</script>

<style lang="scss">
.nation-wrap {
	background-color: #eee;
	margin-top: 15px;
	display: flex;
	li {
		width: 25%;
		height: 30px;
		line-height: 30px;
		text-align: center;
		&.active {
			color: green;
		}
	}
}
.unit-list {
	border-top: 1px solid #eee;
	border-left: 1px solid #eee;
	font-size: 0;
	.unit-item {
		display: inline-block;
		font-size: 14px;
		width: 25%;
		height: 30px;
		line-height: 30px;
		text-align: center;
		border-bottom: 1px solid #eee;
		border-right: 1px solid #eee;
		overflow: hidden;
		&.active {
			color: green;
		}
	}
}
</style>