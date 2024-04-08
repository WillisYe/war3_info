<!--
 * @Author: dary
 * @Date: 2021-03-05 17:37:34
 * @LastEditors: dary
 * @LastEditTime: 2021-03-09 15:15:16
 * @Description: file content
-->

<template>
	<view class="customer-services">
		<u-navbar title="宝物大全" title-color="#fff" :background="{'backgroundColor': '#26a2ff'}" :is-back="false"></u-navbar>

		<view class="content-outer">
			<view class="unit-list">
				<view @click="changeTab(index, tab)" :class="current.index===index?'active':''" class="unit-item" v-for="(tab,index) in tabs" :key="tab.key">{{tab.name}}</view>
			</view>
			<view class="list-wrap" v-for="(item) in current.list" :key="item.level">
				<view class="list-tit">
					{{item.level}}级
				</view>
				<view class="item-wrap" v-for="(prop,index) in item.list" :key="index">
					<image class="item-img" mode="widthFix" :src="prop.icon"></image>
					<view class="item-info">
						<view class="item-tit"> {{prop.name}} </view>
						<view class="item-info-inner">
							<text v-if="prop.Cost">黄金:{{prop.Cost}}</text>							
							<text v-if="prop['Stock Max'] && prop['Stock Max']>1">库存:{{(prop['Stock Max'])}}</text>
							<text v-if="prop['Stock Repl. Interval']">刷新时间:{{(prop['Stock Repl. Interval'])}}s</text>
							<text v-if="prop['Cooldown']">冷却时间:{{(prop['Cooldown'])}}s</text>
							<text v-if="prop['Duration']">持续时间:{{(prop['Duration'])}}s</text>
							<text v-if="prop['Purchase Hotkey']">快捷键:{{(prop['Purchase Hotkey'])}}</text>
							<text v-if="prop['Charges'] && prop['Charges']>1">使用次数:{{(prop['Charges'])}}</text>
							<text v-if="prop['Sold From']">{{getMerchantName(prop['Sold From'])}}</text>
						</view>
						<template v-for="(propVal,propKey) in prop" :key="propKey">
							<view v-if="keysOther.includes(propKey)"> {{propKey}}:{{propVal}} </view>
						</template>
						<view class="item-des"> {{prop.Description}} </view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import _itemsData from "@/common/json/items.json";
	var itemsData = _itemsData.map(item => {
		item.Level = item.Level || '0'
		var arr = item.icon.split('/')
		item.icon = '/static/items/' + arr[arr.length - 1]
		return item
	});

	export default {
		name: 'ServiceCenter',
		data() {
			return {
				tabs: [],
				current: {
					list: [],
					index: 0
				},
				keysOther: [],
				maps: {
					Merchant: {
						"Goblin Merchant": "地精商店",
						"Ancient of Wonders": "奇迹古树",
						"Tomb of Relics": "古墓废墟",
						"Voodoo Lounge": "巫毒商店",
						"Arcane Vault": "神秘藏宝室",
					}
				}
			}
		},
		computed: {

		},
		onLoad() {
			var tabArr = itemsData.map(item => item.Class)
			var tabs = [...new Set(tabArr)].filter(item => item)
			this.tabs = tabs.map(item => {
				return {
					name: item,
					key: item
				}
			})
			this.changeTab(0, this.tabs[0]);

			var keys = []
			for (const item of itemsData) {
				keys = keys.concat(Object.keys(item))
			}
			var keyList = [...new Set(keys)]
			this.keysOther = keyList.filter(item => !['name', 'Class', 'Level', 'Cost', 'Description', 'icon', 'Sell value', 'url', 'Sold From', 'Stock Max', 'Stock Repl. Interval', 'Purchase Hotkey', 'Charges', 'Cooldown', "Cooldown Group", "Stock Start Delay", "Duration"].includes(item))
			console.log(this.keysOther)
		},
		onShow() {

		},
		methods: {
			changeTab(index, tab) {
				this.current.index = index;
				var list = itemsData.filter(item => item.Class == tab.key);
				var levelsArr = list.map(item => item.Level)
				var levels = [...new Set(levelsArr)].filter(item => item).sort()
				this.current.list = levels.map(level => {

					var items = list.filter(item => item.Level == level)
					var uniqueItems = Array.from(new Map(items.map(item => [item.name, item])).values());
					// uniqueItems = uniqueItems.sort((a, b) => a.Cost - b.Cost)

					return {
						level: level,
						list: uniqueItems
					}
				})

				console.log(this.current.list)
			},
			getMerchantName(merchant) {
				var name = this.maps.Merchant[merchant]
				if (!name) {
					var arr = []
					var _merchant = merchant
					Object.entries(this.maps.Merchant).forEach(([key, val]) => {
						if (_merchant.includes(key)) {
							arr.push(val)
							_merchant = _merchant.replace(key, '')
						}
					});
					if (_merchant) {
						arr.push(_merchant)
					}
					return arr.join(',')
				}
				return name
			}
		}
	}
</script>

<style lang="scss" scoped>
	.unit-list {
		border-top: 1px solid #eee;
		border-left: 1px solid #eee;
		font-size: 0;
		.unit-item {
			display: inline-block;
			font-size: 14px;
			width: 33.3%;
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
	.list-wrap {
		margin-top: 10px;
		.list-tit {
			font-weight: 900;
			margin-top: 20px;
			margin-bottom: 10px;
		}
		.item-wrap {
			display: flex;
			align-items: start;
			margin-bottom: 10px;
			line-height: 1.5;
			.item-img {
				width: 64px;
				height: 64px;
				margin-right: 10px;
				flex: 0 0 64px;
			}
			.item-info {
				.item-tit {
					color: #ff0000;
				}
				.item-info-inner {
					& > * {
						display: inline-block;
						margin-right: 10px;
						&:last-child {
							margin-right: 0;
						}
					}
				}
			}
		}
	}
</style>