<template>
  <v-card class="ma-8 elevation-0">
    <v-data-table :headers="headers" :items="tableData">
      <template v-slot:top>
        <div>
          <v-dialog v-model="dialog" max-width="700">
            <template v-slot:activator="{ on, attrs }">
              <div class="pa-4 px-8">
                <v-btn class="white--text" color="teal" v-bind="attrs" v-on="on"
                  >添加时间<v-icon>mdi-add</v-icon></v-btn
                >
              </div>
            </template>
            <v-card class="pa-8 pb-0">
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-text class="indigo--text">
                  <v-row align="center">
                    <v-col cols="3">
                      <div class="mr-6 text-h5">方向:</div>
                    </v-col>
                    <v-col cols="6" class="mt-2">
                      <v-select
                        dense
                        :items="select.direction"
                        v-model="hadSelect.direction"
                        label="请选择"
                        required
                        :rules="[(v) => !!v || 'Item is required']"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col cols="3">
                      <div class="mr-6 text-h5">阶段:</div>
                    </v-col>
                    <v-col cols="6 mt-2">
                      <v-select
                        dense
                        :items="select.stage"
                        v-model="hadSelect.stage"
                        label="请选择"
                        required
                        :rules="[(v) => !!v || 'Item is required']"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col cols="3">
                      <div class="mr-6 text-h5">地点:</div>
                    </v-col>
                    <v-col cols="6" class="mt-2">
                      <v-text-field
                        label="请输入"
                        v-model="hadSelect.place"
                        required
                        :rules="[(v) => !!v || 'Item is required']"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col cols="3">
                      <div class="mr-6 text-h5">限制人数:</div>
                    </v-col>
                    <v-col cols="6" class="mt-2">
                      <v-text-field
                        label="请输入"
                        v-model="hadSelect.limitNumber"
                        required
                        :rules="[(v) => !!v || 'Item is required']"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col cols="3">
                      <div class="mr-6 text-h5">时间:</div>
                    </v-col>
                    <v-col>
                      <v-menu
                        v-model="showMenu1"
                        :close-on-content-click="false"
                        transition="scale-transition"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="hadSelect.dateTime"
                            prepend-icon="mdi-calendar"
                            v-bind="attrs"
                            v-on="on"
                            required
                            :rules="[(v) => !!v || 'Item is required']"
                            label="Date"
                          >
                          </v-text-field>
                        </template>
                        <v-date-picker
                          v-model="hadSelect.dateTime"
                          @input="showMenu1 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col
                      ><v-menu
                        v-model="showMenu2"
                        :close-on-content-click="false"
                        transition="scale-transition"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="hadSelect.hourTime"
                            prepend-icon="mdi-clock-outline"
                            v-bind="attrs"
                            v-on="on"
                            required
                            :rules="[(v) => !!v || 'Item is required']"
                            label="Hour"
                          >
                          </v-text-field>
                        </template>
                        <v-time-picker
                          v-model="hadSelect.hourTime"
                          @input="showMenu2 = false"
                        ></v-time-picker> </v-menu
                    ></v-col>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex justify-center">
                      <v-btn
                        color="primary"
                        :disabled="!valid"
                        @click="putAppointTime"
                        >提交</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-form>
            </v-card>
          </v-dialog>
        </div>
      </template>
      <template v-slot:[`item.option`]="{ item }">
        <v-btn tile class="elevation-0" color="error" text :disabled="item.exit" @click="deleteAppointTime(item)"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbar" timeout="3000">
      可能出错了 请找阿烨
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false"
          >CLOSE</v-btn
        >
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import { D_REQUEST } from "../network/table";
export default {
  name: "orderTime",

  components: {},

  data: () => ({
    headers: [
      {
        text: "方向",
        value: "direction",
        sortable: false,
        align: "center",
      },
      {
        text: "阶段",
        value: "stage",
        sortable: false,
        align: "center",
      },
      {
        text: "时间",
        value: "time",
        sortable: false,
        align: "center",
      },
      {
        text: "地点",
        value: "place",
        sortable: false,
        align: "center",
      },
      {
        text: "人数限制",
        value: "limitNumber",
        sortable: false,
        align: "center",
      },
      {
        text: "操作",
        value: "option",
        sortable: false,
        align: "center",
      },
    ],
    tableData: [
      /* {
        direction: "前端",
        stage: "笔试",
        time: "2021-3-8",
        place: "教五108",
        limitNumber: 10,
        disable: false,
      }, */
    ],
    snackbar: false,
    dialog: false,
    select: {
      direction: ["前端", "后台"],
      stage: ["笔试", "第一轮面试", "第二轮面试", "第一轮考核", "第二轮考核"],
    },
    hadSelect: {
      direction: "",
      stage: "",
      dateTime: "",
      hourTime: "",
      place: "",
      limitNumber: "",
    },
    showMenu1: false,
    showMenu2: false,
    valid: true,
    //
  }),
  methods: {
    getSelectAppointTime() {
      D_REQUEST.GET_selectAppointTime().then((res) => {
        if (res.code == 1200) {
          this.tableData = res.data.map((item) => {
            return {
              direction: item.direction,
              stage: item.stageName,
              time: item.time,
              place: item.place,
              limitNumber: item.limitNumber,
              timeId: item.timeId,
            };
          });
        } else {
          this.snackbar = true;
        }
      });
    },
    putAppointTime() {
      if (this.$refs.form.validate()) {
        const obj = {
          direciton: this.hadSelect.direction,
          stageName: this.hadSelect.stage,
          place: this.hadSelect.place,
          limitNumber: this.hadSelect.limitNumber,
          time: `${this.hadSelect.dateTime} ${this.hadSelect.hourTime}`,
        };
        D_REQUEST.PUT_insertAppointTime(obj).then((res) => {
          if (res.code == 1200) {
            obj.timeId = res.data;
            this.tableData.push(obj);
          } else {
            this.snackbar = true;
          }
        });
      }
    },
    deleteAppointTime(item) {
      D_REQUEST.PUT_deleteAppointTime(item.timeId).then((res) => {
        if (res.code == 1200) {
          for (const [items, index] of this.tableData) {
            if (items.timeId == item.timeId) {
              items.disable = true;
              break;
            }
          }
        } else {
          this.snackbar = true;
        }
      });
    },
  },
  created(){
    console.log(1);
    this.getSelectAppointTime()
  }
};
</script>

