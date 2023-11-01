import { defineStore } from 'pinia'

export const useList = defineStore('list', {
	persist: {
		enabled: true,
		detached: true,
		H5Storage: window?.localStorage,
		strategies: [{
			key: "pinia_list",
			// state 中的字段名，按组打包储存
			// paths: ["foo", "bar"]
		}]
	},
	state: () => ({
		list: [],
	}),
	getters: {

	},
	actions: {
		addItem(item) {
			var cur = this.list.find(i => i.type == item.type && i.brand == item.brand && i.taste == item.taste)
			if (cur) {
				cur.priceMin = Math.min(cur.priceMin, item.price)
				cur.priceMax = Math.max(cur.priceMax, item.price)
				cur.price = cur.priceMin
				cur.updateTime = item.createTime
				cur.count = (+cur.count) + (+item.count)
				cur.expirationDate = Math.min(cur.expirationDate, item.expirationDate)
				cur.batch = cur.batch || []
				cur.batch.unshift(item)

				// var priceTotal = cur.batch.reduce((previous, current) => {
				// 	return previous + (+current.price)
				// }, 0)

				// cur.price = parseFloat((priceTotal / cur.batch.length).toFixed(2))
			} else {
				this.list.unshift({ ...item, batch: [item], priceMin: item.price, priceMax: item.price, updateTime: item.createTime })
			}
		},
		toOut(item, index, indexp) {
			//
		}
	},
})