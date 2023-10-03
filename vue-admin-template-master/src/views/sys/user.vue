<template>
    <div>
        <!--搜索栏-->
        <el-card id="search">
            <el-row>
              <el-col :span="20">
                <el-input v-model="searchModel.username" placeholder="用户名查询" clearable></el-input>
                <el-input v-model="searchModel.phone" placeholder="电话查询" clearable></el-input>
                <el-button type="primary" @click="getUserList" round icon="el-icon-search">查询</el-button>
                <!--icon可以在官网上查询对应图标-->
              </el-col>
              <el-col :span="4" align="right">
    `           <el-button @click="openEditUI(null)" type="primary" icon="el-icon-plus" circle ></el-button>
              </el-col>  
            </el-row>
        </el-card>

        <!--结果列表-->
        <!--在这里加入element-ui中的表格-->
        <el-card>
            <el-table :data="userList" stripe style="width: 100%">
              <el-table-column type="index" label="#" width="180">
                <template slot-scope="scope">
                    <!--(pageNo-1) * pageSize + index + 1-->
                    {{(searchModel.pageNo-1) * searchModel.pageSize + scope.$index + 1}}
                    <!--这里通过scope.$index拿到当前行的索引号-->
                </template>
              </el-table-column>
              <el-table-column prop="id" label="用户ID" width="180">

              </el-table-column>
              <el-table-column prop="username" label="用户名" width="180">

              </el-table-column>
              <el-table-column prop="phone" label="电话" width="180">

              </el-table-column>
              <el-table-column prop="status" label="用户状态" width="180">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status == 1">正常</el-tag>
                  <el-tag type="danger" v-if="scope.row.status == 0">禁用</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="email" label="电子邮件">

              </el-table-column>
              <el-table-column prop="操作" width="180">
                <template slot-scope="scope">
                  <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" size="mini" circle></el-button>
                  <el-button @click="deleteUser(scope.row)" type="danger" icon="el-icon-delete" size="mini" circle></el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-card>

        <!--用户信息编辑对话框，点击右上角的添加按钮之后会自动地弹出的窗口布局-->
        <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
            <!--注意这里使用的如果为:，则后面调用的是title变量，如果没有加:则后面直接调用的是title，visible.sync为表单是否可见-->
            <el-form :model="userForm" ref="userFormRef" :rules="rules">
              <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
                <!--label-width指的是到左边框的宽度，v-model为绑定的变量-->
                <el-input v-model="userForm.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item v-if="userForm.id == null || userForm.id == undefined" label="登录密码" prop="password" :label-width="formLabelWidth">
                <!--label-width指的是到左边框的宽度，v-model为绑定的变量-->
                <el-input type="password" v-model="userForm.password" autocomplete="off"></el-input>
              </el-form-item>
            <el-form-item label="联系电话" prop="phone" :label-width="formLabelWidth">
                <!--label-width指的是到左边框的宽度，v-model为绑定的变量-->
                <el-input v-model="userForm.phone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户状态" prop="status" :label-width="formLabelWidth">
                <!--label-width指的是到左边框的宽度，v-model为绑定的变量-->
                <el-switch 
                v-model="userForm.status"
                :active-value="1"
                :inactive-value="0">
                </el-switch>
            </el-form-item>
            <el-form-item label="电子邮件" prop="email" :label-width="formLabelWidth">
                <!--label-width指的是到左边框的宽度，v-model为绑定的变量-->
                <el-input v-model="userForm.email" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button @click="saveUsers" type="primary">确 定</el-button>
            </div>
        </el-dialog>

        <!--分页组件-->
        <template>
            <div class="block">
              <span class="demonstration">显示总数</span>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchModel.pageNo"
                :page-sizes="[5,10,20,50]"
                :page-size="searchModel.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </div>
        </template>
    </div>
</template>

<script>
import userApi from '@/api/userManager'
export default {
    data(){
        var checkEmail = (rule, value, callback) => {
          var reg =
            /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
          if (!reg.test(value)) {
            return callback(new Error("邮箱格式错误"));
          }
          callback();
        };
        return {
            formLabelWidth: '130px',
            userForm: {},
            title: "",
            dialogFormVisible: false,
            total: 0,
            searchModel:{
                pageNo: 1,
                pageSize: 10,
                username: "",
                phone: ""
            },
            userList:[],
            rules: {
              username: [
                { required: true, message: "请输入用户名", trigger: "blur" },
                {
                  min: 3,
                  max: 50,
                  message: "长度在 3 到 50 个字符",
                  trigger: "blur",
                },
              ],
              password: [
                { required: true, message: "请输入登录初始密码", trigger: "blur" },
                {
                  min: 6,
                  max: 16,
                  message: "长度在 6 到 16 个字符",
                  trigger: "blur",
                },
              ],
              email: [
                { required: true, message: "请输入电子邮件", trigger: "blur" },
                { validator: checkEmail, trigger: "blur" },
                //这里的验证器采用上面的checkEmail函数
              ],
            }
        }
    },
    methods:{
        deleteUser(user){
          this.$confirm(`您确认删除用户 ${user.username} ?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            userApi.deleteUserById(user.id).then(response => {
              this.$message({
                type: 'success',
                message: response.message
              });
              this.getUserList();//刷新数据
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
        },
        saveUsers() {
          //触发表单验证
          console.log("saveUser111")
          this.$refs.userFormRef.validate((valid) => {
            if(valid) {
              //提交请求给后台                
              console.log('this.userForm.id = '+this.userForm.id)
              console.log('this.userForm.password = '+this.userForm.password)
              this.saveUser(this.userForm).then(response => {
                // 成功提示，需要关闭对话框，并且刷新表格
                this.$message({
                  message: response.message,
                  type: 'success'
                });
              })};
              //关闭对话框
              this.dialogFormVisible = false;
              //刷新表格
              this.getUserList();
          })
        },
    
        saveUser(user){
          console.log("saveUser222")
          console.log('user.id = '+user.id);
          console.log('user.password = '+user.password)
          console.log('this.form.id = '+this.userForm.id)
          console.log('this.form.password = '+this.userForm.password);
          if(user.id == null || user.id == undefined)
          {
            console.log('addUser');
            return userApi.addUser(user);
          }
          console.log('updateUser');
          return userApi.updateUser(user);
          //目前问题：添加按钮和编辑按钮都无法点击
        },
        clearForm(){
          this.userForm = {};
          this.$refs.userFormRef.clearValidate();
        },
        openEditUI(id){
            if(id == null)
            {
              this.title = '新增用户';
            }
            else
            {
              this.title = '修改用户';
              //根据id查询用户数据
              userApi.getUserById(id).then(response => {
                this.userForm = response.data;
              });
            }
            this.title = '新增用户',
            this.dialogFormVisible = true
        },
        handleSizeChange(pageSize){
            this.searchModel.pageSize = pageSize;
            this.getUserList();
        },
        handleCurrentChange(pageNo){
            this.searchModel.pageNo = pageNo;
            this.getUserList();
        },
        /*
        这里修改之后能够生效的原因在于在分页组件中调用了pageSize和pageNo两个属性
        <template>
            <div class="block">
              <span class="demonstration">显示总数</span>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="searchModel.pageNo"
                :page-sizes="[5,10,20,50]"
                :page-size="searchModel.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </div>
        </template>
        */
        getUserList(){
            userApi.getUserList(this.searchModel).then(response => {
                this.userList = response.data.rows;
                this.total = response.data.total;
            });
        }
    },
    created(){
        console.log("Hello world!");
        this.getUserList();
    }
}
</script>

<style>
#search .el-input{
    width: 200px;
    margin-right: 10px;
}
.el-dialog .el-input{
    width: 80%;
}
</style>