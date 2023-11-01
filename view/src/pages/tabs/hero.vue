<template>
  <div>
    <mt-header fixed title="统计分析"></mt-header>
    <div class="content-wrap">
      <mt-navbar v-model="selected">
        <mt-tab-item id="hero" @click.native="handleChange">英雄</mt-tab-item>
        <mt-tab-item id="unit" @click.native="handleChange">单位</mt-tab-item>
      </mt-navbar>
      <div class="btns-group">
        <mt-button v-for="(item) in types[selected]" :key="item.key" size="small" :type="type==item.key?'primary':''" @click="changeType(item.key)">{{item.name}}</mt-button>
      </div>
      <mt-progress v-for="(item) in list.current" :key="item.id" :value="100*getVal(item).val/(list.max)" :bar-height="10">
        <div slot="start" style="width:100px;">{{item.name}}</div>
        <div slot="end" style="padding-left:15px;overflow:hidden;" :style="{width:getVal(item).width+'px'}">{{getVal(item).tit}}</div>
      </mt-progress>
    </div>
  </div>
</template>

<script>
  import Papa from "papaparse";
  import heroData from "../../store/heroData";
  import unitData from "../../store/unitData";
  export default {
    data() {
      return {
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
      };
    },
    computed: {
      currentList: function() {
        return this.list[this.selected];
      }
    },
    methods: {
      handleChange() {
        this.changeType("gj");
      },
      changeType(type) {
        this.list.current = [];
        this.type = type;
        this.list.current = this.currentList.sort((citem, nitem) => {
          return this.getVal(nitem).val - this.getVal(citem).val;
        });
        this.list.max = this.getVal(this.list.current[0]).val;
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
            t = `${r} (${level["力量"][0]}/${level["敏捷"][0]}/${
              level["智力"][0]
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
          width
        };
      },
      getUnitVal(item) {
        if (item.main) {
          return 0;
        }
        let params = JSON.parse(
          item.params.replace(/\s/g, " ").replace(/\\/g, "/")
        );
        let r,
          width = 100;
        let cur = this.types.unit.find(item => item.key == this.type);
        let t = params[cur.param];
        if (!t && cur.paramo) {
          t = params[cur.paramo];
        }
        switch (this.type) {
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
            r = t
              ? t.replace("（", "/").split("/")[0]
              : "-";
            r = (1 / r).toFixed(2);
            break;
          case "ys":
            t && (r = t.replace(/\D/g, " "));
            break;
          case "sc":
            t = t || "近战";
            t && (r = t.replace(/[^\d\.]/g, " "));
            break;
          case "gj":
            width = 150;
            t && (r = t.replace(/[^\d\.]/g, " "));
            break;
          case "time":
          case "level":
            width = 50;
            t && (r = t.replace(/[^\d\.]/g, " "));
            break;
          default:
            t && (r = t.replace(/[^\d\.]/g, " "));
            break;
        }
        if (this.type == "sc" && item.name == '山岭巨人') {
          console.log(item.name, t, r);
        }
        return {
          val: parseFloat(r) || 0,
          tit: (t + "").replace(/[平均速秒等） ]/g, "").replace('（', '/'),
          width
        };
      }
    },
    created() {
      this.list.hero = heroData;
      this.list.unit = unitData.filter(item => !item.name.includes("骷髅"));
      this.changeType(this.type);
      this.$http.get("/api/unit", {}).then(
        res => {
          this.list.unit = res.data.data.filter(
            item => !item.name.includes("骷髅")
          );
          this.changeType(this.type);
        },
        err => {
          this.list.unit = unitData.filter(item => !item.name.includes("骷髅"));
          this.changeType(this.type);
        }
      );
      this.$http.get("/api/hero", {}).then(
        res => {
          this.list.hero = res.data.data;
          this.changeType(this.type);
        },
        err => {
          this.list.hero = heroData;
          this.changeType(this.type);
        }
      );
    }
  };
</script>

<style lang="scss">
  .btns-group {
    .mint-button {
      margin: 10px 5px;
    }
  }
</style>
