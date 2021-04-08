<template>
  <v-card class="ma-8 elevation-0">
    <v-data-table
      light
      :headers="headers"
      :items="tableData"
      :items-per-page="10"
      show-select
      v-model="selectedTable"
      item-key="stuNumber"
    >
      <template v-slot:top>
        <v-container fluid>
          <v-row class="mt-1">
            <v-col cols="12" sm="4" class="d-flex justify-center">
              <v-dialog
                transition="dialog-bottom-transition"
                max-width="500"
                v-model="dialog.dialog1"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="white--text"
                    color="teal"
                    v-bind="attrs"
                    v-on="on"
                    >批量通过</v-btn
                  >
                </template>
                <template v-slot:default="dialog">
                  <v-card>
                    <v-toolbar color="primary" dark dense>再次确认</v-toolbar>
                    <v-card-text class="text-h5 pa-12"
                      >选择的人将会 <span class="blue--text">通过</span> 于{{
                        select.hadCurrentStage
                      }}</v-card-text
                    >
                    <div class="d-flex justify-end">
                      <v-btn
                        text
                        color="primary"
                        class="text-subtitle-1"
                        @click="updateStage(1)"
                        >确定</v-btn
                      >
                    </div>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>
            <v-col cols="12" sm="4" class="d-flex justify-center">
              <v-dialog
                transition="dialog-bottom-transition"
                max-width="500"
                v-model="dialog.dialog2"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="error" v-bind="attrs" v-on="on">批量淘汰</v-btn>
                </template>
                <template v-slot:default="dialog">
                  <v-card>
                    <v-toolbar color="error" dark dense>再次确认</v-toolbar>
                    <v-card-text class="text-h5 pa-12"
                      >选择的人将会 <span class="red--text">淘汰</span>于{{
                        select.hadCurrentStage
                      }}</v-card-text
                    >
                    <div class="d-flex justify-end">
                      <v-btn
                        text
                        color="error"
                        class="text-subtitle-1"
                        @click="updateStage(2)"
                        >确定</v-btn
                      >
                    </div>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>
            <v-col cols="12" sm="4" class="d-flex justify-center">
              <v-dialog
                transition="dialog-bottom-transition"
                max-width="500"
                v-model="dialog.dialog3"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" v-bind="attrs" v-on="on"
                    >发送通知</v-btn
                  >
                </template>
                <template v-slot:default="dialog">
                  <v-card>
                    <v-toolbar color="accent" dark dense>再次确认</v-toolbar>
                    <v-card-text class="text-h5 pa-12">
                      <v-form v-model="valid">
                        <v-text-field
                          v-model="sendMessage"
                          required
                          :rules="[(v) => !!v || 'Item is required']"
                        ></v-text-field>
                      </v-form>
                    </v-card-text>
                    <div class="d-flex justify-end">
                      <v-btn
                        text
                        color="accent"
                        :disabled="!valid"
                        class="text-subtitle-1"
                        @click="sendUserMessage()"
                        >确定</v-btn
                      >
                    </div>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:[`header.direction`]>
        <div
          class="d-flex justify-center align-center mt-2 mx-auto"
          style="width: 100px"
        >
          <v-select
            @change="byDirectionAndStageGetUser()"
            item-color="error"
            class="text-center"
            light
            dense
            :items="select.direction"
            item-text="text"
            item-value="value"
            v-model="select.hadDirection"
          ></v-select>
        </div>
      </template>
      <template v-slot:[`header.currentStage`]>
        <div
          class="d-flex justify-center align-center mt-2 mx-auto"
          style="width: 100px"
        >
          <v-select
            @change="byDirectionAndStageGetUser()"
            class="text-center"
            light
            dense
            :items="select.currentStage"
            item-text="text"
            item-value="value"
            v-model="select.hadCurrentStage"
          ></v-select>
        </div>
      </template>
      <template v-slot:[`header.situation`]>
        <div
          class="d-flex justify-center align-center mt-2 mx-auto"
          style="width: 100px"
        >
          <v-select
            item-color="green"
            class="text-center"
            light
            dense
            :items="select.situation"
            item-text="text"
            item-value="value"
            v-model="select.hadSituation"
          ></v-select>
        </div>
      </template>
      <template v-slot:[`item.direction`]="{ item }">
        <v-chip :color="getDirectionColor(item.direction)" dark outlined>
          {{ item.direction }}
        </v-chip>
      </template>
      <template v-slot:[`item.situation`]="{ item }">
        <v-btn
          plain
          :color="getSituationColor(item.situation)"
          style="padding: 0"
          >{{ item.situation }}</v-btn
        >
      </template>
      <template v-slot:[`item.options`]="{ item }">
        <div class="d-flex justify-center">
          <v-btn
            @click="personUpdateStage(1, item)"
            tile
            class="mr-4 elevation-0"
            color="success"
            text
            :disabled="
              item.situation == 1 ||
                item.situation == '通过' ||
                selectedTable.length >= 2
            "
          >
            <v-icon>mdi-{{ item.options[0] }}</v-icon></v-btn
          >
          <v-btn
            @click="personUpdateStage(2, item)"
            tile
            class="mr-4 elevation-0"
            color="error"
            text
            :disabled="
              item.situation == 2 ||
                item.situation == '淘汰' ||
                selectedTable.length >= 2
            "
            ><v-icon>mdi-{{ item.options[1] }}</v-icon></v-btn
          >
          <v-btn
            tile
            class="elevation-0"
            color="primary"
            text
            @click="getDetailUser(item)"
          >
            <v-icon>mdi-{{ item.options[2] }}</v-icon>
          </v-btn>
          <v-dialog
            v-model="item.detailDialog"
            transition="dialog-bottom-transition"
            max-width="800"
          >
            <v-card class="">
              <v-card-title
                class="white--text mb-5"
                :style="getSituationColor2(item.situation)"
                dense
              >
                信息详情
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="3">姓名:</v-col>
                  <v-col cols="4">{{ detail.name }}</v-col>
                </v-row>
                <v-row>
                  <v-col cols="3">学号:</v-col>
                  <v-col cols="4">{{ detail.stuNumber }}</v-col>
                </v-row>
                <v-row>
                  <v-col cols="3">方向:</v-col>
                  <v-col cols="4">{{ detail.direction }}</v-col>
                </v-row>
                <v-row>
                  <v-col cols="3">手机号:</v-col>
                  <v-col cols="4">{{ detail.phoneNumber }}</v-col>
                </v-row>
                <v-row>
                  <v-col cols="3">自我介绍:</v-col>
                  <v-col>{{ detail.introduce }}</v-col>
                </v-row>
                <v-row
                  v-for="(schedu, index) in detail.scheduleInfos"
                  :key="index"
                >
                  <v-col cols="3">阶段{{ index + 1 }}:</v-col>
                  <v-col>{{ schedu.recruitmentStage }}</v-col>
                  <v-col v-if="schedu.adoptChecked == 0">待审阅</v-col>
                  <v-col
                    v-else-if="schedu.adoptChecked == 1"
                    class="light-green--text"
                    >通过</v-col
                  >
                  <v-col v-else-if="schedu.adoptChecked == 2" class="red--text"
                    >淘汰</v-col
                  >
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
        </div>
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
import { D_REQUEST } from '../network/table'
export default {
  name: 'dataDetail',

  components: {},

  data: () => ({
    /* headers: [
      {
        text: "姓名",
        align: "start",
        value: "name",
        sortable: false,
        align: "center",
      },
      {
        text: "学号",
        value: "stuNumber",
        sortable: false,
        align: "center",
      },
      {
        text: "方向",
        value: "direction",
        sortable: false,
        align: "center",
      },
      {
        text: "当前阶段",
        value: "currentStage",
        class: "text-center",
        sortable: false,
        align: "center",
      },
      {
        text: "通过情况",
        value: "situation",
        sortable: false,
        align: "center",
      },
      {
        text: "预约情况",
        value: "appointment",
        sortable: false,
        align: "center",
      },
      {
        text: "操作",
        value: "options",
        sortable: false,
        align: "center",
      },
    ], */
    tableData: [
      /* {
        name: "sb昌辉",
        stuNumber: 3119004824,
        direction: "前端",
        currentStage: "笔试",
        options: ["check", "close"],
        situation: "通过",
        appointment: "未预约",
      },
      {
        name: "sb昌辉",
        stuNumber: 3119004825,
        direction: "后端",
        currentStage: "第二轮面试",
        options: ["check", "close"],
        situation: "淘汰",
        appointment: "未预约",
      },
      {
        name: "sb昌辉",
        stuNumber: 3119004823,
        direction: "后端",
        currentStage: "笔试",
        options: ["check", "close"],
        situation: "待审核",
        appointment: "未预约",
      }, */
    ],
    selectedTable: [],
    select: {
      hadDirection: '前端',
      hadCurrentStage: '笔试',
      hadSituation: '全部',
      direction: [
        { text: '前端', value: '前端' },
        { text: '后端', value: '后端' },
      ],
      currentStage: [
        {
          text: '笔试',
          value: '笔试',
        },
        {
          text: '第一轮面试',
          value: '第一轮面试',
        },
        {
          text: '第二轮面试',
          value: '第二轮面试',
        },
        {
          text: '第一轮考核',
          value: '第一轮考核',
        },
        {
          text: '第二轮考核',
          value: '第二轮考核',
        },
        {
          text: '招收',
          value: '招收',
        },
      ],
      situation: [
        {
          text: '全部',
          value: '全部',
        },
        {
          text: '通过',
          value: '通过',
        },
        {
          text: '淘汰',
          value: '淘汰',
        },
        {
          text: '待审核',
          value: '待审核',
        },
      ],
    },
    dialog: {
      dialog1: false,
      dialog2: false,
      dialog3: false,
    },
    snackbar: false,
    detail: {
      /* introduce:'起飞的萨拉卡卡楼上的静安寺董景安死哦的骄傲啊的祭祀哦啊世界第哦啊世界第哦啊氨基酸第哦啊就是i哦大祭司哦 ',
      phoneNumber:1810285736,
      name:'邓智烨',
      stuNumber:3119004823,
      direction:'前端',
      scheduleInfos:[
        {
        scheduleId: null,
        userId: null,
        recruitmentStage: "报名成功",
        adoptChecked: 1,
        currentTime: "2021-03-09 16:56:59",
        uploadTime: null,
        checked: 0
      },
        {
        scheduleId: null,
        userId: null,
        recruitmentStage: "笔试",
        adoptChecked: 2,
        currentTime: "2021-03-09 16:56:59",
        uploadTime: null,
        checked: 0
      },
      ] */
    },
    sendMessage: '',
    valid: true,
    //
  }),
  computed: {
    headers() {
      return [
        {
          text: '姓名',
          align: 'start',
          value: 'name',
          sortable: false,
          align: 'center',
        },
        {
          text: '学号',
          value: 'stuNumber',
          align: 'center',
        },
        {
          text: '方向',
          value: 'direction',
          sortable: false,
          align: 'center',
        },
        {
          text: '当前阶段',
          value: 'currentStage',
          class: 'text-center',
          sortable: false,
          align: 'center',
        },
        {
          text: '通过情况',
          value: 'situation',
          sortable: false,
          align: 'center',
          filter: (value) => {
            if (this.select.hadSituation == '全部') return true
            else return value == this.select.hadSituation
          },
        },
        {
          text: '预约情况',
          value: 'appointment',
          sortable: false,
          align: 'center',
        },
        {
          text: '操作',
          value: 'options',
          sortable: false,
          align: 'center',
        },
      ]
    },
  },
  methods: {
    getDirectionColor(direction) {
      if (direction == 1 || direction == '前端') {
        return 'primary'
      } else if (direction == 2 || direction == '后端') {
        return 'green'
      } else return 'error'
    },
    getSituationColor(situation) {
      const colorArr = ['warn', 'green', 'error', 'warn']
      const situationArr = ['待审核', '通过', '淘汰']
      const color =
        typeof situation == Number
          ? colorArr[situation]
          : colorArr[situationArr.indexOf(situation)]
      return color
    },
    getSituationColor2(situation) {
      const colorArr = [
        'background:#B0BEC5',
        'background:#4CAF50',
        'background:#F44336',
        'background:#BDBDBD',
      ]
      const situationArr = ['待审核', '通过', '淘汰']
      const color =
        typeof situation == Number
          ? colorArr[situation]
          : colorArr[situationArr.indexOf(situation)]
      return color
    },
    byDirectionAndStageGetUser() {
      // const stageArr = [
      //   "笔试",
      //   "一轮面试",
      //   "二轮面试",
      //   "一轮考核",
      //   "二轮考核",
      //   "招收",
      // ];
      // const directionArr = ["前端", "后端"];
      // const direction = directionArr.indexOf(this.select.hadDirection) + 1;
      // const stage = stageArr.indexOf(this.select.hadCurrentStage) + 1;
      D_REQUEST.GET_byDirectionAndStageGetUser({
        direction: this.select.hadDirection == '前端' ? '前端' : '后台',
        stage: this.select.hadCurrentStage,
      }).then((res) => {
        if (res.code == 1200) {
          const data = res.data.map((item) => {
            const situationArr = ['待审核', '通过', '淘汰']
            return {
              ids: item.userId,
              name: item.name,
              currentStage: item.stage,
              direction: item.direction,
              situation: situationArr[item.adoptChecked],
              options: ['check', 'close', 'account-details'],
              appointment: '未预约',
              stuNumber: item.stuNumber,
              detailDialog: false,
            }
          })
          this.tableData = data
        } else {
          this.snackbar = true
        }
      })
    },
    updateStage(adoptChecked) {
      const idArr = this.selectedTable.map((item) => item.ids)
      const obj = {
        ids: idArr,
        adoptChecked,
        recruitmentStage: this.select.hadCurrentStage,
      }
      D_REQUEST.PUT_updateStage(obj).then((res) => {
        if (res.code == 1200) {
          for (let i = 0; i < idArr.length; i++) {
            for (let y = 0; y < this.tableData.length; y++) {
              if (idArr[i] == this.tableData[y].ids) {
                this.tableData[y].situation =
                  adoptChecked == 1 ? '通过' : '淘汰'
                break
              }
            }
          }
          this.dialog.dialog1 = false
          this.dialog.dialog2 = false
          this.selectedTable = []
        } else {
          this.snackbar = true
        }
      })
    },
    personUpdateStage(adoptChecked, item) {
      const idsArr = [item.ids]
      const obj = {
        ids: idsArr,
        adoptChecked,
        recruitmentStage: this.select.hadCurrentStage,
      }
      D_REQUEST.PUT_updateStage(obj).then((res) => {
        if (res.code == 1200) {
          for (const items of this.tableData) {
            if (items.stuNumber == item.stuNumber) {
              items.situation = adoptChecked == 1 ? '通过' : '淘汰'
              break
            }
          }
        }
      })
    },
    getDetailUser(item) {
      D_REQUEST.GET_detailUser(item.ids).then((res) => {
        if (res.code == 1200) {
          const obj = {
            introduce: res.data.introduce,
            phoneNumber: res.data.phoneNumber,
            name: item.name,
            stuNumber: item.stuNumber,
            direction: item.direction,
            scheduleInfos: res.data.scheduleInfos.filter((item) => {
              return item.currentTime
            }),
          }
          this.detail = obj
          item.detailDialog = true
        } else {
          this.snackbar = true
        }
      })
    },
    sendUserMessage() {},
  },
  created() {
    this.byDirectionAndStageGetUser()
  },
}
</script>
