import { defineStore } from 'pinia'

export const useOptions = defineStore('options', {
	persist: {
		enabled: true,
		detached: true,
		H5Storage: window?.localStorage,
		strategies: [{
			key: "pinia_options",
			// state 中的字段名，按组打包储存
			// paths: ["foo", "bar"]
		}]
	},
	state: () => ({
		type: [
			{ value: '1', text: '主食罐头' },
			{ value: '2', text: '零食罐头' },
			{ value: '3', text: '冻干' },
			{ value: '4', text: '药品' },
		],
		brand: [
			{ value: '1', text: '巅峰' },
			{ value: '2', text: '金交' },
			{ value: '3', text: '渴望' },
			{ value: '4', text: '爱肯拿' },
			{ value: '5', text: '纽翠斯' },
			{ value: '6', text: '伯纳' },
			{ value: '7', text: '百利' },
			{ value: '8', text: '卫仕' },
			{ value: '9', text: 'Venandi' },
		],
		taste: [
			{ value: '1', text: '鸡肉口味' },
			{ value: '2', text: '鱼肉口味' },
			{ value: '3', text: '牛肉口味' },
			{ value: '4', text: '羊肉口味' },
			{ value: '5', text: '鹿肉口味' },
		],
		channel: [
			{ value: '1', text: '拼多多' },
			{ value: '2', text: '淘宝' },
			{ value: '3', text: '京东' },
			{ value: '4', text: '咸鱼' },
		],
	}),
	getters: {

	},
	actions: {
		getTextByValue(value, key, type) {
			var obj = this[key].find(item => item.value == value)
			return obj?.text || ''
		},
		addItem(text, key, cb) {
			// 新增标签，之后返回新增项的id
			var list = this[key]
			var cur = list.find(item => item.text == text)
			if (!cur) {
				var ids = list.map(item => item.value)
				var id = Math.max.apply(null, ids) + 1
				list.push({ value: id, text: text })
				cb && cb(id)
			} else {
				cb && cb(cur.value)
			}
		}
	},
})