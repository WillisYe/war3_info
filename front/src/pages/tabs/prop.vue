<template>
	<view class="customer-services">
		<u-navbar title="宝物大全" title-color="#fff" :background="{'backgroundColor': '#26a2ff'}" :is-back="false"></u-navbar>

		<view class="content-outer">
			<view class="unit-list">
				<view @click="changeTab(index, tab)" :class="current.index===index?'active':''" class="unit-item" v-for="(tab,index) in tabs" :key="tab.key">{{maps.type[tab.name] || tab.name}}</view>
			</view>
			<view class="list-wrap" v-for="(item) in current.list" :key="item.level">
				<view class="list-tit">
					{{item.level}}级（{{item.list.length}}）
				</view>
				<view class="u-flex u-col-center u-flex-wrap">
					<image @click="showDetail(prop)" v-for="(prop,index) in item.list" :key="index" class="item-img" mode="widthFix" :src="prop.icon"></image>
				</view>
			</view>
		</view>

		<u-popup v-model="detailPopup.show" mode="bottom" border-radius="14" closeable>
			<view class="item-wrap">
				<image class="item-img" mode="widthFix" :src="detailPopup.data.icon"></image>
				<view class="item-info">
					<view class="item-tit"> {{detailPopup.data.name}} </view>
					<view class="item-info-inner">
						<text v-if="detailPopup.data.Cost">黄金:{{detailPopup.data.Cost}}</text>
						<text v-if="detailPopup.data['Stock Max'] && detailPopup.data['Stock Max']>1">库存:{{(detailPopup.data['Stock Max'])}}</text>
						<text v-if="detailPopup.data['Stock Repl. Interval']">刷新时间:{{(detailPopup.data['Stock Repl. Interval'])}}s</text>
						<text v-if="detailPopup.data['Cooldown']">冷却时间:{{(detailPopup.data['Cooldown'])}}s</text>
						<text v-if="detailPopup.data['Duration']">持续时间:{{(detailPopup.data['Duration'])}}s</text>
						<text v-if="detailPopup.data['Cast Time']">施法时间:{{(detailPopup.data['Cast Time'])}}s</text>
						<text v-if="detailPopup.data['Purchase Hotkey']">快捷键:{{(detailPopup.data['Purchase Hotkey'])}}</text>
						<text v-if="detailPopup.data['Charges'] && detailPopup.data['Charges']>1">使用次数:{{(detailPopup.data['Charges'])}}</text>
						<text v-if="detailPopup.data['Sold From']">{{getMerchantName(detailPopup.data['Sold From'])}}</text>
					</view>
					<template v-for="(propVal,propKey) in detailPopup.data" :key="propKey">
						<view v-if="keysOther.includes(propKey)"> {{propKey}}:{{propVal}} </view>
					</template>
					<view class="item-des"> {{detailPopup.data.Description}} </view>
				</view>
			</view>
		</u-popup>
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
					},
					type: {
						"Permanent": "永久宝",
						"Charged": "消耗宝",
						"Power Up": "书籍",
						"Artifact": "神器",
						"Purchasable": "商店",
						"Miscellaneous": "其它",
					}
				},
				detailPopup: {
					show: false,
					data: {}
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
			this.keysOther = keyList.filter(item => !['name', 'Class', 'Level', 'Cost', 'Description', 'icon', 'Sell value', 'url', 'Sold From', 'Stock Max', 'Stock Repl. Interval', 'Purchase Hotkey', 'Charges', 'Cooldown', "Cooldown Group", "Stock Start Delay", "Duration", "Cast Time"].includes(item))
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
			},
			showDetail(prop) {
				this.detailPopup.data = prop
				this.detailPopup.show = true
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
			margin-bottom: 10px;
		}
	}
	.item-img {
		width: 64px;
		height: 64px;
		margin-right: 10px;
		margin-bottom: 10px;
		flex: 0 0 64px;
	}
	.item-wrap {
		display: flex;
		align-items: start;
		padding: 10px;
		line-height: 1.5;

		.item-img {
			margin-bottom: 0px;
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
</style>