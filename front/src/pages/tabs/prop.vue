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
	let imgs = [
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/staffofpreservation.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/staffofsanctuary.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/cloak.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/gauntletsofogrestrength.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/mantleofintelligence.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/slippersofagility.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/staffofteleportation.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/circlet.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/clawsofattack.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/glove.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/ringgreen.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/bootsofspeed.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/clawsofattack.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/ringgreen.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/pendantofenergy.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/periapt.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/ringskull.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/talisman.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/orbofcorruption.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/orbofvenom.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/orboffire.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/orboflightning.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/runedbracers.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/sobimask.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/belt.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/boots.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/robeofthemagi.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/alleriaflute.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/bonechimes.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/hornofdoom.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/lionhorn.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/drum.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/ancientjanggo.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/pipeofinsight.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/clawsofattack.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/crystalball.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/cloakofflames.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/helmofvalor.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/hoodofcunning.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/medallionofcourage.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/spellshieldamulet.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/periapt1.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/pendantofmana.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/ringgreen.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/orbofdarkness.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/staffofsilence.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/clawsofattack.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/ringgreen.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/orboffrost.gif",
		"http://image2.sina.com.cn/gm/ol/war3/lqbz/BAOWU02.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/crownofkings.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/maskofdeath.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/manual.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/tomeblue.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/tomeblue.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/tomeblue.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/tomebrown.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/tomeblue.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/tomeblue.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/tomeblue.gif",
		"http://image2.sina.com.cn/gm/ol/war3/lqbz/BAOWU01.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/tomered.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/healing.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/healingsalve.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/mana.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/lesserclaritypotion.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/scrollofregenerationgreen.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/scrollofhealing.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/greaterhealing.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/greatermana.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/rejuvpotion.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/potionofrestoration.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/scrollofrestoration.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/healthstone.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/manastone.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/lesserinvulneralbility.gif",
		"http://image2.sina.com.cn/gm/ol/war3/lqbz/0011.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/potionofdivinity.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/orc/spells/healingward.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/bookofthedead.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/stonetoken.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/reddrakeegg.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/felhound.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/stone.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/iceshard.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/amuletofthewild.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/demonicfigurine.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/infernalstone.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/scrollofanimatedead.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/scrollofresurrection.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/dustofappearance.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/wand.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/tomeofretraining.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/tinygreathall.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/ivorytower.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/mechanicalcritter.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/moonstone.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/ankh.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/wandofthewind.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/scrollofthebeast.gif",
		"http://image2.sina.com.cn/gm/upload/20040813/88/1092378821/war3/images/items/wandofmanasteal.gif"
	];

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