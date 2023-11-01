<!--
 * @Author: dary
 * @Date: 2021-03-05 17:37:34
 * @LastEditors: dary
 * @LastEditTime: 2021-03-09 14:37:56
 * @Description: file content
-->

<template>
	<view class="customer-services">
		<u-navbar title="统计分析" title-color="#fff" :background="{'backgroundColor': '#26a2ff'}" :is-back="false"></u-navbar>
		<div class="content-outer">
			<view class="">
				<u-tabs :list="tabs" :is-scroll="false" :current="current" @change="handleChange"></u-tabs>
			</view>

			<view class="btns-group">
				<button class="btn-type" v-for="(item) in types[selected]" :key="item.key" size="mini" :type="type==item.key?'primary':''" @click="changeType(item.key)">{{item.name}}</button>
			</view>

			<view class="flex ai-center padding-top-8 fs-14" v-for="(item, index) in list.current" :key="item.id + '_' + index">
				<view class="width-100">{{item.name}}</view>
				<u-line-progress class="flex1" :percent="getPercent(item)" :height="25" :show-percent="true" active-color="#26a2ff"> </u-line-progress>
				<view class="margin-left-6" :style="{width:getVal(item).width+'px'}">{{getVal(item).tit}}</view>
				<!-- <view class="margin-left-6" :style="{width:getVal(item).width+'px'}">{{getVal(item).val}} {{list.max}}</view> -->
			</view>
		</div>
	</view>
</template>

<script>
import heroData from "@/common/data/heroData";
import unitData from "@/common/data/unitData";

export default {
	name: 'ServiceCenter',
	data() {
		return {
			tabs: [{
				name: '英雄',
				key: 'hero'
			}, {
				name: '单位',
				key: 'unit'
			}],
			current: 0,
			type: "gj",
			selected: "hero",
			list: {
				hero: [],
				unit: [],
				current: [],
				max: 0
			},
			types: {
				hero: [
					{
						key: "gj",
						name: "攻击",
						param: "攻击力[平均值]"
					},
					{
						key: "hj",
						name: "护甲",
						param: "护甲"
					},
					{
						key: "gs",
						name: "攻速",
						param: "攻击频率"
					},
					{
						key: "ys",
						name: "移速",
						param: "移动速度"
					},
					{
						key: "sm",
						name: "生命",
						param: "生命"
					},
					{
						key: "mf",
						name: "魔法",
						param: "魔法"
					},
					{
						key: "ll",
						name: "力量",
						param: "力量"
					},
					{
						key: "mj",
						name: "敏捷",
						param: "敏捷"
					},
					{
						key: "zl",
						name: "智力",
						param: "智力"
					},
					{
						key: "sw",
						name: "三围",
						param: "三围"
					}
				],
				unit: [
					{
						key: "gj",
						name: "地面攻击",
						param: "地面攻击"
					},
					{
						key: "dkgj",
						name: "对空攻击",
						param: "对空攻击"
					},
					{
						key: "gold",
						name: "金钱",
						param: "训练费用"
					},
					{
						key: "wood",
						name: "木头",
						param: "训练费用"
					},
					{
						key: "rk",
						name: "人口",
						param: "训练费用"
					},
					{
						key: "gs",
						name: "攻速",
						param: "攻击间隔"
					},
					{
						key: "sc",
						name: "射程",
						param: "射程",
						paramo: "最远射程"
					},
					{
						key: "hj",
						name: "护甲",
						param: "护甲类型"
					},
					{
						key: "ys",
						name: "移速",
						param: "移动速度"
					},
					{
						key: "hp",
						name: "生命",
						param: "生命"
					},
					{
						key: "hpg",
						name: "生命性价比",
						param: "生命性价比"
					},
					{
						key: "level",
						name: "等级",
						param: "单位级别"
					},
					{
						key: "time",
						name: "训练时间",
						param: "训练时间"
					}
				]
			}
		}
	},
	computed: {
		currentList: function () {
			return this.list[this.selected];
		}
	},
	onLoad() {
		this.list.hero = heroData;
		this.list.unit = unitData.filter(item => !item.name.includes("骷髅"));
		this.changeType(this.type);
		// this.$u.get("/api/unit", {}).then(
		// 	res => {
		// 		this.list.unit = res.data.data.filter(
		// 			item => !item.name.includes("骷髅")
		// 		);
		// 		this.changeType(this.type);
		// 	},
		// 	err => {
		// 		this.list.unit = unitData.filter(item => !item.name.includes("骷髅"));
		// 		this.changeType(this.type);
		// 	}
		// );
		// this.$u.get("/api/hero", {}).then(
		// 	res => {
		// 		this.list.hero = res.data.data;
		// 		this.changeType(this.type);
		// 	},
		// 	err => {
		// 		this.list.hero = heroData;
		// 		this.changeType(this.type);
		// 	}
		// );
	},
	onShow() {

	},
	methods: {
		togglePopup() {
			this.popupVisible = !this.popupVisible;
		},
		handleChange(index) {
			this.current = index;
			this.selected = this.tabs[index].key;
			this.changeType("gj");
		},
		changeType(type) {
			this.list.current = [];
			this.type = type;
			this.list.current = this.currentList.sort((citem, nitem) => {
				return this.getVal(nitem).val - this.getVal(citem).val;
			});
			this.list.max = this.getVal(this.list.current[0]).val;
			// this.$forceUpdate();
		},
		getVal(item) {
			if (!item) {
				return false;
			}
			if (this.selected == "hero") {
				return this.getHeroVal(item);
			} else {
				return this.getUnitVal(item);
			}
		},
		getHeroVal(item) {
			if (!item.main) {
				return 0;
			}
			let level = JSON.parse(item.level);
			let params = JSON.parse(item.params);
			let r,
				t,
				width = 50;
			let param = this.types.hero.find(item => item.key == this.type).param;
			switch (this.type) {
				case "gj":
					t = level[param][0];
					r = t.split("[")[1].slice(0, -1);
					width = 100;
					break;
				case "gs":
					t = params[param];
					r = (1 / t).toFixed(2);
					break;
				case "ys":
					t = params[param];
					r = t.split("（")[1].slice(0, -1);
					width = 100;
					break;
				case "sw":
					r =
						parseFloat(level["力量"][0]) +
						parseFloat(level["敏捷"][0]) +
						parseFloat(level["智力"][0]);
					t = `${r} (${level["力量"][0]}/${level["敏捷"][0]}/${level["智力"][0]
						})`;
					width = 110;
					break;
				default:
					t = level[param][0];
					r = level[param][0];
					break;
			}

			return {
				val: r,
				tit: t
					.replace(/[速秒等]/g, "")
					.replace("平均", "中")
					.replace("普通", "中"),
				width: width - 15
			};
		},
		getUnitVal(item, type=this.type) {
			if (item.main) {
				return 0;
			}
			let params = JSON.parse(
				item.params.replace(/\s/g, " ").replace(/\\/g, "/")
			);
			let r,
				width = 80;
			let cur = this.types.unit.find(item => item.key == type);
			let t = params[cur.param];
			if (!t && cur.paramo) {
				t = params[cur.paramo];
			}
			switch (type) {
				case "gold":
					r = t.split("/")[0];
					break;
				case "wood":
					r = t.split("/")[1];
					break;
				case "rk":
					r = t.split("/")[2];
					break;
				case "gs":
					width = 65;
					r = t
						? t.replace("（", "/").split("/")[0]
						: "-";
					r = (1 / r).toFixed(2);
					break;
				case "ys":
					width = 95;
					t && (r = t.replace(/\D/g, " "));
					break;
				case "sc":
					t = t || "近战";
					t && (r = t.replace(/[^\d\.]/g, " "));
					break;
				case "gj":
					width = 90;
					t && (r = t.replace(/[^\d\.]/g, " "));
					break;
				case "time":
				case "level":
					width = 20;
					t && (r = t.replace(/[^\d\.]/g, " "));
					break;
				case "dkgj":
					width = 55;
					t && (r = t.replace(/[^\d\.]/g, " "));
					break;
				default:
					t && (r = t.replace(/[^\d\.]/g, " "));
					break;
			}
			
			var result = {
				val: parseFloat(r) || 0,
				tit: (t + "").replace(/          /, '/').replace(/[平均速秒等）\) ]/g, "").replace(/[\(（]/g, '/'),
				width: width
			};

			if (type == "hj" && ['石像鬼'].includes(item.name)) {
				// console.log(`${item.name}, t:${t}, r:${r}`);
				// console.log(JSON.stringify(result, null, 2))
			}
			if (type == "sc" && ['投石车'].includes(item.name)) {
				console.log(`${item.name}, t:${t}, r:${r}`);
				console.log(JSON.stringify(result, null, 2))
			}
			if (type == "hpg") {
				result = {
					val: this.getUnitVal(item, 'hp').val/(this.getUnitVal(item, 'gold').val || 1e10) || 0,
					width: 130
				};
				result.tit=  `${result.val.toFixed(1)}[${this.getUnitVal(item, 'hp').val}/${this.getUnitVal(item, 'gold').val}]`
			}
			return result;
		},
		getPercent(item) {
			var val = 100*this.getVal(item).val/(this.list.max);
			val = val.toFixed(0);
			return +val;
		}
	}
}
</script>

<style lang="scss">
.tips-outer {
	table {
		max-width: 100% !important;
		width: 100% !important;
		height: auto !important;
	}
	img {
		max-width: 100% !important;
		width: 100% !important;
		height: auto !important;
		min-width: 60px;
	}
}
.btn-type {
	margin: 10rpx;
}
</style>