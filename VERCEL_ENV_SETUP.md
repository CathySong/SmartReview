# 🔧 Vercel 环境变量配置指南

## 🎯 为SmartReview配置OpenAI API密钥

### **前提条件：**
1. **OpenAI API密钥** - 从 https://platform.openai.com/api-keys 获取
2. **Vercel账户** - 已连接GitHub仓库
3. **SmartReview仓库** - https://github.com/CathySong/SmartReview

## 📋 环境变量清单

### **必需环境变量：**
```env
OPENAI_API_KEY=sk-...your_openai_api_key_here...
```

### **可选环境变量：**
```env
GOOGLE_API_KEY=AIza...your_google_api_key_here...
GOOGLE_PLACE_ID=your_google_place_id_here
BUSINESS_NAME="Xie Bao Crab House"
BUSINESS_TYPE="seafood restaurant"
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=random_string_at_least_32_chars
```

## 🚀 配置步骤

### **步骤1：获取OpenAI API密钥**
1. 访问 https://platform.openai.com/api-keys
2. 登录您的OpenAI账户
3. 点击"Create new secret key"
4. 复制生成的API密钥（以`sk-`开头）
5. **重要**：保存密钥，关闭页面后无法再次查看

### **步骤2：在Vercel中配置环境变量**
1. **访问Vercel仪表板**: https://vercel.com
2. **选择SmartReview项目**
3. **进入设置**: 点击项目 → Settings
4. **环境变量**: 左侧菜单选择"Environment Variables"
5. **添加变量**:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: 粘贴您的OpenAI API密钥
   - **Environment**: Production (或所有环境)
6. **保存**: 点击"Save"

### **步骤3：重新部署**
1. **手动触发部署**: 在Vercel项目页面点击"Deployments" → "Redeploy"
2. **或等待自动部署**: 推送代码到GitHub会自动触发
3. **验证部署**: 等待部署完成，访问您的应用URL

## 🔍 验证配置

### **方法1：使用测试页面**
1. 访问您的应用: `https://your-app.vercel.app/test-api`
2. 查看API状态
3. 测试AI生成功能

### **方法2：检查日志**
1. 在Vercel仪表板中查看部署日志
2. 查找"OpenAI API Key check"日志
3. 确认API密钥已正确加载

### **方法3：功能测试**
1. 访问主页面
2. 尝试生成AI评论
3. 验证是否使用OpenAI API（而非后备评论）

## 🐛 故障排除

### **问题1：API密钥无效**
**症状**: AI生成使用后备评论，不调用OpenAI
**解决方案**:
1. 验证API密钥格式（应以`sk-`开头）
2. 检查OpenAI账户余额
3. 确保API密钥未过期或被撤销

### **问题2：环境变量未加载**
**症状**: 日志显示"OpenAI API key not configured"
**解决方案**:
1. 确认环境变量名称正确（`OPENAI_API_KEY`）
2. 检查环境变量作用域（Production/Preview/Development）
3. 重新部署应用

### **问题3：API调用失败**
**症状**: 错误消息如"Invalid API key"或"Rate limit exceeded"
**解决方案**:
1. 检查OpenAI账户使用量和限制
2. 验证API密钥权限
3. 等待速率限制重置

### **问题4：Vercel部署失败**
**症状**: 构建失败或部署错误
**解决方案**:
1. 检查构建日志中的错误信息
2. 验证环境变量语法
3. 确保Next.js配置正确

## 📊 环境变量最佳实践

### **安全性：**
- ✅ **不要**在代码中硬编码API密钥
- ✅ **不要**提交`.env`文件到GitHub
- ✅ **使用**Vercel环境变量管理
- ✅ **定期**轮换API密钥

### **管理：**
- ✅ **为不同环境**设置不同变量（Production/Preview/Development）
- ✅ **使用描述性**变量名称
- ✅ **保持变量**文档更新
- ✅ **监控使用量**和成本

### **备份：**
- ✅ **导出**环境变量备份
- ✅ **记录**变量用途和值格式
- ✅ **测试**新密钥后再更新生产环境

## 🔧 技术细节

### **代码中的环境变量访问：**
```typescript
// 在服务器端组件或API路由中
const apiKey = process.env.OPENAI_API_KEY;

// 在客户端组件中（通过next.config.js暴露）
// 注意：客户端只能访问NEXT_PUBLIC_前缀的变量
```

### **Next.js配置：**
```javascript
// next.config.js
module.exports = {
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    // 其他变量...
  },
}
```

### **AI生成器初始化：**
```typescript
// lib/ai-generator.ts
constructor(apiKey?: string) {
  const key = apiKey || process.env.OPENAI_API_KEY;
  // 初始化OpenAI客户端...
}
```

## 🎯 验证成功配置

### **成功迹象：**
1. ✅ **部署成功** - 无构建错误
2. ✅ **日志显示** - "OpenAI client initialized successfully"
3. ✅ **功能正常** - AI生成使用OpenAI API
4. ✅ **响应快速** - 评论生成在2-5秒内完成
5. ✅ **质量提升** - 评论更个性化、自然

### **测试流程：**
1. **访问应用**: `https://your-app.vercel.app`
2. **生成评论**: 点击"New Options"按钮
3. **检查结果**: 查看生成的评论质量
4. **验证日志**: 在Vercel日志中查看API调用

## 📞 技术支持

### **OpenAI支持：**
- **文档**: https://platform.openai.com/docs
- **状态**: https://status.openai.com
- **计费**: https://platform.openai.com/usage
- **限制**: https://platform.openai.com/account/limits

### **Vercel支持：**
- **文档**: https://vercel.com/docs
- **环境变量**: https://vercel.com/docs/projects/environment-variables
- **部署**: https://vercel.com/docs/deployments
- **日志**: https://vercel.com/docs/observability/logs

### **SmartReview支持：**
- **GitHub**: https://github.com/CathySong/SmartReview
- **问题**: 在GitHub仓库创建Issue
- **文档**: 查看项目README和部署指南

---

## ✅ 配置完成检查清单

- [ ] **获取OpenAI API密钥**（以`sk-`开头）
- [ ] **登录Vercel仪表板**
- [ ] **选择SmartReview项目**
- [ ] **添加`OPENAI_API_KEY`环境变量**
- [ ] **保存并重新部署**
- [ ] **验证部署成功**
- [ ] **测试AI生成功能**
- [ ] **检查日志确认API调用**
- [ ] **监控OpenAI使用量和成本**

---

**🎉 配置完成后，您的SmartReview将使用OpenAI GPT生成高质量的个性化评论！**

**预期效果**:
- 🤖 **AI生成评论** - 20词个性化评论
- 📸 **照片上下文** - 基于上传照片生成相关评论
- 🍽️ **菜品感知** - 针对具体菜品生成评论
- 🚀 **快速响应** - 2-5秒内生成评论
- 💰 **成本可控** - 约$0.002/100条评论

**立即开始为Xie Bao Crab House生成更多5星评价！** 🦀⭐