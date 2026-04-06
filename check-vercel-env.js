#!/usr/bin/env node

/**
 * Vercel环境变量检查脚本
 * 用于验证OpenAI API密钥是否正确配置
 */

console.log('🔍 检查Vercel环境变量配置...\n');

// 检查环境变量
const envVars = {
  'OPENAI_API_KEY': process.env.OPENAI_API_KEY,
  'NODE_ENV': process.env.NODE_ENV,
  'VERCEL': process.env.VERCEL,
  'VERCEL_ENV': process.env.VERCEL_ENV,
  'VERCEL_URL': process.env.VERCEL_URL,
};

console.log('📊 当前环境变量状态:');
console.log('='.repeat(50));

Object.entries(envVars).forEach(([key, value]) => {
  const status = value ? '✅' : '❌';
  const displayValue = value 
    ? (key.includes('KEY') ? `${value.substring(0, 10)}...${value.substring(value.length - 4)}` : value)
    : '未设置';
  
  console.log(`${status} ${key}: ${displayValue}`);
});

console.log('\n🔧 OpenAI API密钥检查:');
console.log('='.repeat(50));

const apiKey = process.env.OPENAI_API_KEY;
if (apiKey) {
  console.log(`✅ API密钥已设置 (长度: ${apiKey.length} 字符)`);
  
  if (apiKey.startsWith('sk-')) {
    console.log('✅ 密钥格式正确 (以 "sk-" 开头)');
  } else {
    console.log('❌ 密钥格式不正确 (应以 "sk-" 开头)');
  }
  
  if (apiKey.length >= 40) {
    console.log('✅ 密钥长度足够');
  } else {
    console.log('⚠️  密钥长度可能不足 (通常应≥40字符)');
  }
} else {
  console.log('❌ API密钥未设置');
  console.log('\n📝 设置说明:');
  console.log('1. 访问 https://platform.openai.com/api-keys 获取API密钥');
  console.log('2. 在Vercel项目设置中添加环境变量 OPENAI_API_KEY');
  console.log('3. 重新部署应用');
}

console.log('\n🌐 部署环境检查:');
console.log('='.repeat(50));

if (process.env.VERCEL) {
  console.log('✅ 运行在Vercel环境');
  console.log(`   环境: ${process.env.VERCEL_ENV || 'production'}`);
  console.log(`   URL: ${process.env.VERCEL_URL || '未设置'}`);
} else {
  console.log('ℹ️  运行在本地开发环境');
  console.log('   环境变量应从 .env.local 文件加载');
}

console.log('\n🚀 Next.js环境变量配置:');
console.log('='.repeat(50));

// 检查next.config.js中的环境变量配置
try {
  const fs = require('fs');
  const nextConfig = fs.readFileSync('next.config.js', 'utf8');
  
  if (nextConfig.includes('OPENAI_API_KEY')) {
    console.log('✅ next.config.js 已配置环境变量');
  } else {
    console.log('❌ next.config.js 未配置环境变量');
  }
  
  if (nextConfig.includes('env:')) {
    console.log('✅ next.config.js 有env配置部分');
  }
} catch (error) {
  console.log('⚠️  无法读取next.config.js文件');
}

console.log('\n📋 AI生成器状态:');
console.log('='.repeat(50));

// 模拟AI生成器初始化
const key = process.env.OPENAI_API_KEY;
if (key && key.startsWith('sk-')) {
  console.log('✅ AI生成器可以正常初始化');
  console.log('   将使用OpenAI GPT生成评论');
} else {
  console.log('⚠️  AI生成器将使用后备评论');
  console.log('   功能受限，建议配置有效的API密钥');
}

console.log('\n🎯 建议操作:');
console.log('='.repeat(50));

if (!apiKey) {
  console.log('1. 🔑 获取并设置OpenAI API密钥');
} else if (!apiKey.startsWith('sk-')) {
  console.log('1. 🔑 检查API密钥格式 (应以 "sk-" 开头)');
} else {
  console.log('1. ✅ API密钥配置正确');
}

if (!process.env.VERCEL) {
  console.log('2. 🚀 部署到Vercel以使用生产环境变量');
} else {
  console.log('2. ✅ 已部署到Vercel');
}

console.log('3. 🧪 访问 /test-api 页面测试API功能');
console.log('4. 📊 监控OpenAI使用量和成本');

console.log('\n' + '='.repeat(50));
console.log('检查完成！');

// 如果API密钥未设置，以错误代码退出
if (!apiKey || !apiKey.startsWith('sk-')) {
  process.exit(1);
}