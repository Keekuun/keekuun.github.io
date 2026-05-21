---
title: 高级 Prompt 技巧：Chain of Thought 与 Few-shot Learning
date: 2026-04-22
isComment: true
categories: 
- AI
- Frontend
tags: 
- Advanced Prompting
- Chain of Thought
- Few-shot Learning
- Reasoning
---

# 高级 Prompt 技巧：Chain of Thought 与 Few-shot Learning

> 掌握让 LLM 深度推理和快速学习的两大核心技术


## 📚 目录

- [引言：为什么需要高级技巧](#引言为什么需要高级技巧)
- [Chain of Thought 深度解析](#chain-of-thought-深度解析)
- [Few-shot Learning 完全指南](#few-shot-learning-完全指南)
- [两种技术的结合使用](#两种技术的结合使用)
- [实战案例：复杂问题解决](#实战案例复杂问题解决)
- [性能优化和最佳实践](#性能优化和最佳实践)
- [常见陷阱和解决方案](#常见陷阱和解决方案)
- [工具和框架支持](#工具和框架支持)
- [练习和挑战](#练习和挑战)

---

## 引言：为什么需要高级技巧

### 基础 Prompt 的局限性

在前一篇文章中，我们学习了基础的 prompt engineering 技巧。但对于复杂任务，基础方法往往不够：

**场景 1：复杂数学问题**
```
❌ 基础 prompt: "计算 234 × 567 ÷ 89 + 123"
结果：可能直接给出错误答案

✅ 需要：逐步推理过程
```

**场景 2：新任务类型**
```
❌ 基础 prompt: "将这个 JSON 转换为 GraphQL schema"
结果：格式不正确或遗漏细节

✅ 需要：提供示例展示期望格式
```

**场景 3：多步骤决策**
```
❌ 基础 prompt: "如何优化这个应用的性能？"
结果：泛泛而谈的建议

✅ 需要：系统性的分析和权衡
```

### 高级技巧的价值

**Chain of Thought (CoT)** 和 **Few-shot Learning** 是解决这些问题的两大核心技术：

| 技术 | 解决的问题 | 提升效果 |
|------|-----------|---------|
| Chain of Thought | 复杂推理、多步计算 | 准确性提升 20-40% |
| Few-shot Learning | 新任务适应、格式控制 | 一致性提升 50-70% |
| 两者结合 | 复杂新任务 | 综合效果最佳 |

**研究数据：**
- GPT-3 在数学推理任务上，CoT 将准确率从 18% 提升到 57%
- Few-shot learning 可以将新任务的适应时间从小时级降到分钟级
- 结合使用时，复杂任务的成功率提升可达 3 倍

---

## Chain of Thought 深度解析

### 什么是 Chain of Thought？

**定义：** Chain of Thought（思维链）是一种 prompt 技术，通过引导 LLM 展示中间推理步骤，提高复杂问题的解决能力。

**核心思想：**
```
人类解题：理解问题 → 分解步骤 → 逐步推理 → 得出答案
传统 LLM：理解问题 → 直接输出答案 ❌
CoT LLM：理解问题 → 展示推理过程 → 得出答案 ✅
```

### 为什么 CoT 有效？

**1. 模拟人类思维过程**

研究表明，LLM 的内部表示更接近"直觉"而非"推理"。CoT 强制模型显式地展示推理链条。

**2. 错误检测和纠正**

当模型逐步推理时，可以在中间步骤发现并纠正错误。

**3. 更好的注意力分配**

逐步推理让模型能够更专注地处理每个子问题。

**4. 可解释性**

用户可以查看推理过程，理解模型是如何得出结论的。

### CoT 的实现方式

#### 方式 1：Zero-shot CoT（最简单）

**方法：** 添加魔法短语 "Let's think step by step"

**示例：**

```
问题：小明有 10 个苹果，吃了 3 个，又买了 5 个，最后给了小红一半。
小明还剩几个苹果？

Let's think step by step.
```

**输出：**
```
让我逐步思考：

1. 初始数量：10 个苹果
2. 吃了 3 个：10 - 3 = 7 个
3. 又买了 5 个：7 + 5 = 12 个
4. 给了小红一半：12 ÷ 2 = 6 个

答案：小明还剩 6 个苹果。
```

**优点：**
- ✅ 极其简单，只需添加一句话
- ✅ 适用于各种问题类型
- ✅ 无需准备示例

**缺点：**
- ❌ 效果不如 few-shot CoT
- ❌ 推理步骤可能不够详细

**适用场景：**
- 快速测试
- 中等复杂度问题
- 不想准备示例时

#### 方式 2：Few-shot CoT（推荐）

**方法：** 提供带推理过程的示例

**完整示例：**

```
请解答以下数学问题，展示完整的推理过程。

问题 1：一个农场有鸡和兔子，总共有 35 个头和 94 条腿。问鸡和兔子各有多少只？

解答：
让我逐步分析：

1. 设变量：
   - 设鸡的数量为 x
   - 设兔子的数量为 y

2. 建立方程：
   - 头的总数：x + y = 35
   - 腿的总数：2x + 4y = 94（鸡有 2 条腿，兔子有 4 条腿）

3. 解方程：
   - 从第一个方程：x = 35 - y
   - 代入第二个方程：2(35 - y) + 4y = 94
   - 展开：70 - 2y + 4y = 94
   - 简化：70 + 2y = 94
   - 解得：2y = 24，所以 y = 12

4. 求 x：
   - x = 35 - 12 = 23

5. 验证：
   - 头数：23 + 12 = 35 ✓
   - 腿数：23×2 + 12×4 = 46 + 48 = 94 ✓

答案：鸡有 23 只，兔子有 12 只。

---

问题 2：{your_question}

解答：
```

**优点：**
- ✅ 效果更好，推理更准确
- ✅ 可以控制推理风格
- ✅ 适合特定领域的问题

**缺点：**
- ❌ 需要准备高质量示例
- ❌ 消耗更多 token

**适用场景：**
- 复杂的专业问题
- 需要特定推理模式
- 生产环境应用

#### 方式 3：Self-ask CoT（进阶）

**方法：** 引导模型自己提出问题并回答

**示例：**

```
问题：React 和 Vue 哪个更适合大型项目？

在回答之前，先问自己几个关键问题：

1. 我需要了解什么信息才能做出判断？
2. 大型项目的关键需求是什么？
3. React 和 Vue 在这些方面的表现如何？

现在，逐一回答这些问题，然后给出结论。
```

**输出：**
```
让我先思考需要回答的关键问题：

**问题 1：大型项目的关键需求是什么？**
- 可扩展性
- 团队协作
- 生态系统
- 长期维护
- 性能表现

**问题 2：React 的表现如何？**
- 可扩展性：优秀，组件化架构清晰
- 团队协作：好，但需要严格的规范
- 生态系统：非常强大，社区活跃
- 长期维护：Facebook 支持，稳定性好
- 性能：优秀，虚拟 DOM 高效

**问题 3：Vue 的表现如何？**
- 可扩展性：良好，但超大型项目可能需要更多规划
- 团队协作：优秀，文档清晰，学习曲线平缓
- 生态系统：良好，但不如 React 丰富
- 长期维护：社区驱动，核心团队稳定
- 性能：优秀，响应式系统高效

**综合分析：**

对于大型项目，我推荐 React，原因如下：
1. 更成熟的生态系统
2. 更大的社区和人才池
3. 更多的企业级应用案例

但如果团队已经熟悉 Vue，Vue 也是很好的选择。
```

**优点：**
- ✅ 更深入的思考
- ✅ 更全面的答案
- ✅ 减少偏见

**缺点：**
- ❌ 更长的响应时间
- ❌ 更多的 token 消耗

### CoT 在不同领域的应用

#### 1. 数学和逻辑推理

**示例：概率问题**

```
问题：掷两个骰子，点数之和为 7 的概率是多少？

Let's think step by step.
```

**期望输出：**
```
让我逐步分析：

1. 确定样本空间：
   - 每个骰子有 6 个面
   - 两个骰子的组合总数：6 × 6 = 36 种

2. 找出和为 7 的组合：
   - (1, 6)
   - (2, 5)
   - (3, 4)
   - (4, 3)
   - (5, 2)
   - (6, 1)
   - 共 6 种组合

3. 计算概率：
   - 概率 = 有利结果数 / 总结果数
   - 概率 = 6 / 36 = 1/6

答案：点数之和为 7 的概率是 1/6 或约 16.67%。
```

#### 2. 代码调试

**示例：找出 Bug**

问题：以下代码为什么会出现无限循环？

```javascript
function processArray(arr) {
    let i = 0;
    while (i < arr.length) {
        if (arr[i] > 0) {
            arr.push(arr[i] * 2);
        }
        i++;
    }
    return arr;
}
```

Prompt 补充：`Let's trace through the execution step by step.`

**期望输出：**

让我逐步追踪执行过程：

1. 初始状态：
   - 假设 arr = [1, 2, 3]
   - i = 0
   - arr.length = 3

2. 第一次迭代（i = 0）：
   - arr[0] = 1 > 0 ✓
   - 执行：arr.push(1 * 2) → arr = [1, 2, 3, 2]
   - arr.length 现在是 4
   - i++ → i = 1

3. 第二次迭代（i = 1）：
   - arr[1] = 2 > 0 ✓
   - 执行：arr.push(2 * 2) → arr = [1, 2, 3, 2, 4]
   - arr.length 现在是 5
   - i++ → i = 2

4. 问题所在：
   - 每次遇到正数，就向数组添加新元素
   - arr.length 不断增加
   - i 也在增加，但永远追不上 arr.length
   - 导致无限循环

5. 根本原因：
   - 在遍历数组的同时修改数组长度
   - 循环条件 i < arr.length 永远为真

修复方案：

```javascript
function processArray(arr) {
    const originalLength = arr.length; // 保存原始长度
    for (let i = 0; i < originalLength; i++) {
        if (arr[i] > 0) {
            arr.push(arr[i] * 2);
        }
    }
    return arr;
}
```

答案：出现无限循环是因为在遍历时不断向数组添加元素，导致数组长度持续增长，循环条件永远满足。

#### 3. 业务决策分析

**示例：技术选型**

```
问题：我们应该使用 MongoDB 还是 PostgreSQL？

背景：我们正在构建一个电商平台，需要存储用户信息、订单、商品数据。

Let's analyze this decision systematically.
```

**期望输出包含：**
- 需求分析
- 两种数据库的对比
- 优缺点权衡
- 最终建议和理由

### CoT 的最佳实践

**✅ Do:**
1. 明确指示要逐步思考
2. 提供清晰的示例（few-shot）
3. 鼓励验证中间结果
4. 要求解释每个步骤的原因

**❌ Don't:**
1. 不要跳过关键步骤
2. 避免过于复杂的单步推理
3. 不要忘记验证最终答案
4. 不要忽略边界情况

**提示词模板：**

```
{task_description}

请按照以下步骤思考和解答：

1. 理解问题：重新表述问题，确保理解正确
2. 分解任务：将问题拆解为小步骤
3. 逐步推理：对每个步骤进行详细推理
4. 验证结果：检查每一步的正确性
5. 总结答案：给出最终结论

开始解答：
```

---

## Few-shot Learning 完全指南

### 什么是 Few-shot Learning？

**定义：** Few-shot Learning（少样本学习）是通过提供少量示例，让 LLM 快速学习新模式或任务的 prompting 技术。

**与传统机器学习的对比：**

| 类型 | 所需数据量 | 训练时间 | 灵活性 |
|------|-----------|---------|--------|
| Zero-shot | 0 示例 | 无 | 高，但效果有限 |
| Few-shot | 1-10 示例 | 无 | 高，效果好 |
| Fine-tuning | 1000+ 样本 | 长 | 低，需重新训练 |

**核心优势：**
- ✅ 无需训练模型
- ✅ 快速适应新任务
- ✅ 灵活调整行为
- ✅ 成本低

### Few-shot 的工作原理

**类比理解：**

想象你在教一个聪明的实习生：

**Zero-shot（零样本）：**
```
你："帮我格式化这些数据"
实习生：（猜测你的意思，可能做错）
```

**Few-shot（少样本）：**
```
你："看这几个例子：
输入: {name: "John", age: 30} → 输出: "John, 30 years old"
输入: {name: "Jane", age: 25} → 输出: "Jane, 25 years old"

现在格式化这个：{name: "Bob", age: 35}"
实习生：（理解模式）"Bob, 35 years old" ✓
```

### Few-shot 的设计原则

#### 原则 1：示例质量至关重要

**好的示例特征：**
- ✅ 准确无误
- ✅ 覆盖典型情况
- ✅ 格式一致
- ✅ 清晰易懂

**坏的示例：**
- ❌ 有错误或模糊
- ❌ 格式不统一
- ❌ 过于复杂或简单
- ❌ 不具代表性

#### 原则 2：示例数量和多样性

**一般规则：**
- **简单任务**：1-3 个示例
- **中等任务**：3-5 个示例
- **复杂任务**：5-10 个示例

**多样性考虑：**
```
情感分类示例：
✅ 正面："这个产品太棒了！"
✅ 负面："服务很差，失望。"
✅ 中性："今天天气还可以。"
✅ 混合："价格贵但质量好。"

而不是：
❌ 正面："太好了！"
❌ 正面："非常棒！"
❌ 正面："超级好！"
```

#### 原则 3：示例的顺序和布局

**推荐格式：**

```
任务描述

示例 1：
输入：{example_input_1}
输出：{example_output_1}

示例 2：
输入：{example_input_2}
输出：{example_output_2}

...

现在处理新的输入：
输入：{new_input}
输出：
```

**关键点：**
- 使用清晰的分隔符
- 保持一致的格式
- 最后留出输出位置

### Few-shot 实战案例

#### 案例 1：文本分类

**任务：** 将客户反馈分类到不同类别

**Prompt：**

```
将客户反馈分类为以下类别之一：
- PRODUCT_QUALITY（产品质量）
- SHIPPING（物流）
- CUSTOMER_SERVICE（客服）
- PRICING（价格）
- OTHER（其他）

示例 1：
反馈："收到的商品有破损，包装也不够结实。"
类别：PRODUCT_QUALITY

示例 2：
反馈："快递太慢了，等了两周才收到。"
类别：SHIPPING

示例 3：
反馈："客服态度很好，问题很快就解决了。"
类别：CUSTOMER_SERVICE

示例 4：
反馈："价格比竞争对手高很多，性价比不高。"
类别：PRICING

现在分类以下反馈：
反馈："网站界面不太友好，找商品很困难。"
类别：
```

**输出：** `OTHER` 或 `WEBSITE_USABILITY`（取决于是否允许新类别）

#### 案例 2：代码转换

**任务：** JavaScript → TypeScript

**Prompt：**

```
将以下 JavaScript 函数转换为 TypeScript，添加适当的类型注解。

示例 1：
JS: function add(a, b) { return a + b; }
TS: function add(a: number, b: number): number { return a + b; }

示例 2：
JS: function greet(name) { return "Hello, " + name; }
TS: function greet(name: string): string { return `Hello, ${name}`; }

示例 3：
JS: function filterUsers(users, minAge) {
    return users.filter(u => u.age >= minAge);
}
TS: interface User { name: string; age: number; }
    function filterUsers(users: User[], minAge: number): User[] {
        return users.filter(u => u.age >= minAge);
    }

现在转换：
JS: function findMax(numbers) {
    return Math.max(...numbers);
}
TS:
```

**输出：**
```typescript
function findMax(numbers: number[]): number {
    return Math.max(...numbers);
}
```

#### 案例 3：数据提取

**任务：** 从非结构化文本提取结构化信息

**Prompt：**

```
从以下文本中提取事件信息，以 JSON 格式返回。

需要提取的字段：
- event_name: 事件名称
- date: 日期（YYYY-MM-DD 格式）
- location: 地点
- participants: 参与者列表

示例 1：
文本："明天下午 3 点，张三和李四将在北京会议室讨论项目计划。"
JSON:
{
    "event_name": "项目计划讨论",
    "date": "2024-05-23",
    "location": "北京会议室",
    "participants": ["张三", "李四"]
}

示例 2：
文本："下周一上午 10 点，王五在上海办公室做技术分享，赵六和钱七参加。"
JSON:
{
    "event_name": "技术分享",
    "date": "2024-05-27",
    "location": "上海办公室",
    "participants": ["王五", "赵六", "钱七"]
}

现在提取：
文本："本周五晚上 7 点，周八在深圳咖啡厅与吴九和郑十见面洽谈合作。"
JSON:
```

**输出：**
```json
{
    "event_name": "合作洽谈",
    "date": "2024-05-24",
    "location": "深圳咖啡厅",
    "participants": ["周八", "吴九", "郑十"]
}
```

#### 案例 4：风格转换

**任务：** 将技术文档转换为通俗易懂的解释

**Prompt：**

```
将以下技术概念用通俗易懂的语言解释，适合非技术人员理解。
使用类比和简单的语言，避免专业术语。

示例 1：
技术概念："API（应用程序编程接口）"
通俗解释："API 就像餐厅的服务员。你（用户）告诉服务员你想吃什么（请求），
服务员把你的需求告诉厨房（系统），然后把做好的菜（响应）端给你。
你不需要知道厨房怎么做菜，只需要通过服务员点餐即可。"

示例 2：
技术概念："数据库索引"
通俗解释："数据库索引就像书的目录。如果你想找某个章节，
可以直接查目录找到页码，而不需要一页页翻完整本书。
索引让查找数据变得更快。"

现在解释：
技术概念："缓存（Cache）"
通俗解释：
```

**输出：**
```
"缓存就像你的书桌。常用的书（数据）放在书桌上，可以随时快速拿到。
不常用的书放在书架上，需要时再去取。
书桌（缓存）空间有限，但访问速度快；书架（主存储）空间大，但访问慢。
通过把常用物品放在手边，提高了工作效率。"
```

### Few-shot 的高级技巧

#### 技巧 1：动态示例选择

**问题：** 固定的示例可能不适用于所有输入

**解决方案：** 根据输入动态选择最相关的示例

```typescript
class DynamicFewShot {
    private examples: Example[];
    
    async generatePrompt(input: string): Promise<string> {
        // 1. 计算输入与所有示例的相似度
        const similarities = await Promise.all(
            this.examples.map(async (ex) => ({
                example: ex,
                similarity: await calculateSimilarity(input, ex.input)
            }))
        );
        
        // 2. 选择最相似的 3 个示例
        const topExamples = similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 3)
            .map(s => s.example);
        
        // 3. 构建 prompt
        return this.buildPrompt(topExamples, input);
    }
}
```

#### 技巧 2：渐进式示例

**方法：** 从简单到复杂排列示例

```
示例 1（简单）：基本用法
示例 2（中等）：带参数
示例 3（复杂）：边缘情况

这样可以帮助模型理解模式的复杂性。
```

#### 技巧 3：负样本示例

**方法：** 包含错误示例和正确示例的对比

```
错误的做法：
输入：...
错误输出：...
问题：缺少类型检查

正确的做法：
输入：...
正确输出：...
说明：添加了类型验证

现在处理新的输入：
```

**优势：**
- 帮助模型理解边界
- 减少常见错误
- 提高鲁棒性

---

## 两种技术的结合使用

### CoT + Few-shot 的强大组合

**原理：** 结合两者的优势，获得最佳效果

**结构：**

```
任务描述

示例 1：
输入：{input_1}

解答过程（CoT）：
1. 第一步推理...
2. 第二步推理...
3. ...

最终答案：{answer_1}

---

示例 2：
输入：{input_2}

解答过程（CoT）：
1. ...
2. ...

最终答案：{answer_2}

---

现在处理新的输入：
输入：{new_input}

解答过程：
```

### 实际案例：复杂数据分析

**任务：** 分析销售数据并提供建议

**Prompt：**

```
你是一个数据分析专家。请分析销售数据，提供洞察和建议。

示例 1：
数据：
- 月份：1月、2月、3月
- 销售额：100万、120万、90万
- 主要变化：2月有情人节促销，3月无活动

分析过程：
1. 观察趋势：
   - 1月到2月增长 20%（100万 → 120万）
   - 2月到3月下降 25%（120万 → 90万）

2. 识别原因：
   - 2月增长可能源于情人节促销
   - 3月下降是因为没有促销活动

3. 计算指标：
   - 平均月销售额：(100 + 120 + 90) / 3 = 103.3万
   - 波动幅度：最大值 120万 - 最小值 90万 = 30万

4. 提出建议：
   - 建议在 3 月也安排促销活动
   - 分析情人节促销的具体效果
   - 考虑其他节日营销机会

建议：
- 短期：策划 3 月下旬的春季促销
- 中期：建立月度促销日历
- 长期：开发客户忠诚度计划

---

示例 2：
数据：
- 产品线：A、B、C
- 销售额：A产品 50万，B产品 30万，C产品 20万
- 利润率：A产品 20%，B产品 35%，C产品 15%

分析过程：
1. 收入分析：
   - A产品贡献最大收入（50%）
   - C产品收入最低（20%）

2. 利润分析：
   - B产品利润率最高（35%）
   - C产品利润率最低（15%）

3. 综合评估：
   - A产品：高收入，中等利润 → 现金牛
   - B产品：中等收入，高利润 → 明星产品
   - C产品：低收入，低利润 → 问题产品

4. 战略建议：
   - 加大对 B 产品的投入
   - 优化 C 产品或考虑淘汰
   - 维持 A 产品的市场份额

建议：
- 优先推广 B 产品
- 重新评估 C 产品策略
- 探索 A 产品的增值服务

---

现在分析以下数据：
数据：
- 渠道：线上、线下
- Q1 销售额：线上 200万，线下 150万
- Q2 销售额：线上 250万，线下 130万
- 增长率：线上 +25%，线下 -13%

分析过程：
```

**期望输出：** 完整的分析过程和建议

### 结合使用的优势

**1. 更高的准确性**
- Few-shot 提供模式
- CoT 确保推理正确

**2. 更好的泛化**
- 示例展示多样性
- 推理过程可适应新情况

**3. 更强的可解释性**
- 可以看到学习模式
- 可以理解推理逻辑

**4. 更易调试**
- 检查示例是否合适
- 检查推理是否有误

---

## 实战案例：复杂问题解决

### 案例 1：算法设计

**问题：** 设计一个智能推荐系统

**Prompt：**

```
设计一个电商平台的商品推荐系统。

请参考以下示例的思路和方法：

示例 1：新闻推荐系统

问题分析：
1. 目标：为用户推荐感兴趣的新闻
2. 挑战：冷启动、多样性、实时性

解决方案设计：
1. 数据收集：
   - 用户行为（点击、阅读时长、分享）
   - 内容特征（类别、标签、关键词）
   - 上下文信息（时间、设备、位置）

2. 算法选择：
   - 协同过滤：基于相似用户的行为
   - 内容推荐：基于文章特征
   - 混合方法：结合多种算法

3. 实现步骤：
   - Step 1: 构建用户画像
   - Step 2: 计算相似度
   - Step 3: 生成候选集
   - Step 4: 排序和过滤
   - Step 5: A/B 测试优化

4. 评估指标：
   - 点击率（CTR）
   - 阅读完成率
   - 用户满意度

---

现在设计电商商品推荐系统：

请按照类似的思路，考虑：
- 电商的特殊性（购买vs浏览）
- 商品属性（价格、类别、品牌）
- 业务目标（转化率、客单价）

你的设计：
```

**期望输出：** 完整的推荐系统设计方案

### 案例 2：架构决策

**问题：** 微服务 vs 单体架构

**Prompt：**

```
为一个初创公司的电商平台选择架构方案。

背景：
- 团队规模：5 人
- 预期用户：首年 10 万，三年 100 万
- 功能：用户、商品、订单、支付
- 预算：有限

请使用决策框架分析：

示例：社交媒体平台架构决策

1. 需求分析：
   - 高并发读取
   - 实时互动
   - 媒体存储

2. 选项评估：

   单体架构：
   优点：开发快、部署简单、调试容易
   缺点：扩展性差、耦合度高
   
   微服务：
   优点：独立扩展、技术灵活、容错性好
   缺点：复杂度高、运维成本、分布式问题

3. 权衡分析：
   - 初期流量不大 → 单体足够
   - 团队小 → 微服务 overhead 太大
   - 未来扩展 → 预留拆分接口

4. 决策：采用模块化单体，为未来微服务拆分做准备

---

现在分析电商平台：

1. 需求分析：
   [你的分析]

2. 选项评估：
   [你的评估]

3. 权衡分析：
   [你的权衡]

4. 最终决策：
   [你的决策和理由]
```

### 案例 3：性能优化

**问题：** React 应用性能优化

**Prompt：**

```
优化一个 React 电商应用的性能。

当前问题：
- 首页加载慢（5秒+）
- 滚动卡顿
- 搜索响应延迟

请参考以下优化案例的思路：

示例：Dashboard 应用优化

问题诊断：
1. 性能分析：
   - 使用 Chrome DevTools Profiler
   - 识别瓶颈组件
   - 分析网络请求

发现的问题：
- 大量不必要的重渲染
- 未优化的图片加载
- 同步的 API 调用

优化措施：
1. 组件层面：
   - 使用 React.memo 包裹纯组件
   - 用 useMemo 缓存计算结果
   - 用 useCallback 缓存函数

2. 数据获取：
   - 实现懒加载
   - 添加请求缓存
   - 使用 SWR 或 React Query

3. 资源优化：
   - 图片懒加载和压缩
   - 代码分割（Code Splitting）
   - Tree Shaking

4. 结果：
   - 加载时间：5s → 1.5s
   - FPS：30 → 60
   - Bundle size：2MB → 800KB

---

现在优化电商应用：

1. 问题诊断：
   [你的诊断方法]

2. 可能的原因：
   [你的分析]

3. 优化方案：
   [具体措施，按优先级排序]

4. 预期效果：
   [量化指标]

5. 实施计划：
   [分阶段执行]
```

---

## 性能优化和最佳实践

### Token 效率优化

**问题：** Few-shot + CoT 消耗大量 token

**优化策略：**

**1. 精简示例**
```
❌ 冗长示例：
输入："这是一个很长的句子，包含了多个词汇和复杂的语法结构..."
输出："经过详细的分析和处理，我们得到了以下结果..."

✅ 精简示例：
输入："长句子..."
输出："结果..."
```

**2. 复用上下文**
```typescript
// 在对话中引用之前的示例
"使用上面提供的格式，处理新的输入..."
```

**3. 分层提示**
```
第一层：简单任务，zero-shot
第二层：复杂任务，few-shot
第三层：非常复杂，few-shot + CoT
```

**4. 缓存示例**
```typescript
class PromptCache {
    private cache = new Map<string, string>();
    
    getPrompt(taskType: string): string {
        if (this.cache.has(taskType)) {
            return this.cache.get(taskType)!;
        }
        
        const prompt = this.buildPrompt(taskType);
        this.cache.set(taskType, prompt);
        return prompt;
    }
}
```

### 质量评估

**如何判断 CoT/Few-shot 的效果？**

**1. 准确性指标**
```typescript
interface EvaluationMetrics {
    accuracy: number;      // 正确率
    consistency: number;   // 一致性
    completeness: number;  // 完整性
    relevance: number;     // 相关性
}
```

**2. A/B 测试**
```typescript
async function abTest(): Promise<void> {
    const baseline = await testPrompt(baselinePrompt);
    const improved = await testPrompt(improvedPrompt);
    
    console.log('Baseline accuracy:', baseline.accuracy);
    console.log('Improved accuracy:', improved.accuracy);
    console.log('Improvement:', 
        ((improved.accuracy - baseline.accuracy) / baseline.accuracy * 100).toFixed(2) + '%'
    );
}
```

**3. 人工评估**
- 抽样检查输出质量
- 收集用户反馈
- 持续改进示例

### 最佳实践清单

**Few-shot Best Practices:**

- [ ] 示例准确无误
- [ ] 覆盖典型场景
- [ ] 格式保持一致
- [ ] 数量适中（3-5 个）
- [ ] 顺序合理（简单→复杂）
- [ ] 包含边界情况

**CoT Best Practices:**

- [ ] 明确要求逐步推理
- [ ] 提供推理示例
- [ ] 鼓励验证结果
- [ ] 分解复杂步骤
- [ ] 保持逻辑连贯
- [ ] 总结最终答案

**结合使用 Best Practices:**

- [ ] 示例包含推理过程
- [ ] 推理模式一致
- [ ] 控制 token 消耗
- [ ] 评估实际效果
- [ ] 持续优化示例
- [ ] 文档化最佳实践

---

## 常见陷阱和解决方案

### 陷阱 1：示例偏差

**问题：** 示例不够多样化，导致模型过拟合

**示例：**
```
❌ 所有示例都是正面情感
→ 模型可能倾向于预测正面

✅ 平衡的示例
→ 正面、负面、中性都有
```

**解决方案：**
- 确保示例的代表性
- 覆盖各种情况
- 定期更新示例

### 陷阱 2：推理跳跃

**问题：** CoT 中跳过关键步骤

**示例：**
```
❌ "通过计算得到答案是 42"
（没有展示计算过程）

✅ "首先...然后...因此答案是 42"
（完整的推理链）
```

**解决方案：**
- 在示例中展示详细步骤
- 明确要求不跳过步骤
- 验证中间结果

### 陷阱 3：示例冲突

**问题：** 示例之间存在矛盾

**示例：**
```
示例 1：日期格式 YYYY-MM-DD
示例 2：日期格式 MM/DD/YYYY
→ 模型困惑
```

**解决方案：**
- 严格一致的格式
- 清晰的规范说明
- 审查所有示例

### 陷阱 4：过度依赖

**问题：** 即使简单任务也使用复杂 prompt

**解决方案：**
```typescript
function selectPromptStrategy(task: Task): Strategy {
    if (task.complexity === 'simple') {
        return 'zero-shot';
    } else if (task.complexity === 'medium') {
        return 'few-shot';
    } else {
        return 'few-shot-cot';
    }
}
```

### 陷阱 5：忽视验证

**问题：** 盲目信任模型输出

**解决方案：**
```typescript
async function validateOutput(
    output: string, 
    constraints: ValidationRules
): Promise<boolean> {
    // 1. 格式验证
    if (!matchesFormat(output, constraints.format)) {
        return false;
    }
    
    // 2. 逻辑验证
    if (!isLogicallyConsistent(output)) {
        return false;
    }
    
    // 3. 业务规则验证
    if (!meetsBusinessRules(output, constraints.rules)) {
        return false;
    }
    
    return true;
}
```

---

## 工具和框架支持

### LangChain 中的实现

**Few-shot Prompt Template:**

```typescript
import { FewShotPromptTemplate } from "langchain/prompts";

const examples = [
    {
        question: "Who lived longer, Muhammad Ali or Alan Turing?",
        answer: `
Are follow up questions needed here: Yes.
Follow up: How old was Muhammad Ali when he died?
Intermediate answer: Muhammad Ali was 74 years old when he died.
Follow up: How old was Alan Turing when he died?
Intermediate answer: Alan Turing was 41 years old when he died.
So the final answer is: Muhammad Ali
`
    },
    // 更多示例...
];

const prompt = new FewShotPromptTemplate({
    examples,
    examplePrompt: PromptTemplate.fromTemplate(
        "Question: {question}\nAnswer: {answer}"
    ),
    prefix: "Answer the following questions by reasoning step-by-step.",
    suffix: "Question: {question}\nAnswer:",
    inputVariables: ["question"],
});
```

**Chain of Thought:**

```typescript
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";

const cotPrompt = PromptTemplate.fromTemplate(`
{question}

Let's think step by step.
`);

const model = new ChatOpenAI({ temperature: 0 });
const chain = cotPrompt.pipe(model);

const result = await chain.invoke({
    question: "What is the square root of 144?"
});
```

### OpenAI Function Calling 结合

**结构化 CoT 输出：**

```typescript
const functions = [
    {
        name: "reasoning_step",
        description: "Record a reasoning step",
        parameters: {
            type: "object",
            properties: {
                step_number: { type: "integer" },
                description: { type: "string" },
                conclusion: { type: "string" }
            }
        }
    }
];

const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: complexQuestion }],
    functions,
    function_call: "auto"
});
```

### 自定义框架

**PromptBuilder 类：**

```typescript
class PromptBuilder {
    private taskDescription: string;
    private examples: Example[] = [];
    private useCoT: boolean = false;
    
    setTask(description: string): this {
        this.taskDescription = description;
        return this;
    }
    
    addExample(input: string, output: string, reasoning?: string): this {
        this.examples.push({ input, output, reasoning });
        return this;
    }
    
    enableChainOfThought(): this {
        this.useCoT = true;
        return this;
    }
    
    build(newInput: string): string {
        let prompt = `${this.taskDescription}\n\n`;
        
        // 添加示例
        this.examples.forEach((ex, i) => {
            prompt += `示例 ${i + 1}:\n`;
            prompt += `输入：${ex.input}\n`;
            
            if (this.useCoT && ex.reasoning) {
                prompt += `推理过程：\n${ex.reasoning}\n`;
            }
            
            prompt += `输出：${ex.output}\n\n`;
        });
        
        // 添加新输入
        prompt += `现在处理：\n输入：${newInput}\n`;
        
        if (this.useCoT) {
            prompt += `推理过程：\n`;
        } else {
            prompt += `输出：`;
        }
        
        return prompt;
    }
}

// 使用
const prompt = new PromptBuilder()
    .setTask("将自然语言转换为 SQL")
    .addExample(
        "找出最贵的产品",
        "SELECT * FROM products ORDER BY price DESC LIMIT 1",
        "1. 需要从 products 表查询\n2. 按价格降序排序\n3. 取第一条记录"
    )
    .enableChainOfThought()
    .build("显示每个类别的平均价格");
```

---

## 练习和挑战

### 练习 1：CoT 基础

**任务：** 使用 zero-shot CoT 解决以下问题

```
问题：如果一个正方形的周长是 48cm，它的面积是多少？

提示：添加 "Let's think step by step"
```

**要求：**
- 展示完整的计算过程
- 验证最终答案

### 练习 2：Few-shot 设计

**任务：** 设计一个 few-shot prompt，用于将 emoji 描述转换为文字

**示例输入：**
- "😊 👍" → "开心且赞同"
- "😢 💔" → "伤心且心碎"

**要求：**
- 创建 3-5 个示例
- 测试新的 emoji 组合
- 评估准确性

### 练习 3：CoT + Few-shot 结合

**任务：** 创建一个代码审查助手

**要求：**
- 提供 2-3 个代码审查示例
- 每个示例包含详细的推理过程
- 涵盖不同类型的问题（bug、性能、安全）

**示例结构：**
```
代码：[有问题的代码]

审查过程：
1. 识别问题类型
2. 分析问题原因
3. 评估严重程度
4. 提供修复建议

审查结果：[结构化输出]
```

### 练习 4：性能优化实验

**任务：** 比较不同 prompt 策略的效果

**实验设计：**
```
测试集：10 个复杂问题

策略 A：Zero-shot
策略 B：Few-shot (3 examples)
策略 C：Few-shot + CoT

测量指标：
- 准确率
- Token 消耗
- 响应时间
```

**要求：**
- 记录实验结果
- 分析 trade-offs
- 给出使用建议

### 练习 5：实际应用

**任务：** 为你的项目创建一个实用的 prompt

**场景选择（任选其一）：**
1. API 文档生成
2. 单元测试生成
3. 用户反馈分析
4. 日志异常检测

**要求：**
- 选择合适的策略（zero/few-shot, with/without CoT）
- 设计高质量的示例
- 测试和优化
- 文档化使用方法

---

## 总结与下一步

### 核心要点回顾

✅ **Chain of Thought:**
- 引导逐步推理
- 提高复杂问题准确性
- Zero-shot 和 Few-shot 两种形式
- 适用于数学、逻辑、调试等场景

✅ **Few-shot Learning:**
- 通过示例快速适应新任务
- 示例质量至关重要
- 3-5 个多样化示例最佳
- 适用于分类、转换、提取等任务

✅ **结合使用:**
- Few-shot 提供模式
- CoT 确保推理正确
- 效果最佳但成本高
- 适合复杂的新任务

### 进阶学习路径

**Level 1: 掌握基础**
- ✅ 完成本文练习
- ✅ 在实际项目中应用
- ✅ 建立 prompt 库

**Level 2: 深入优化**
- 📖 学习 Tree of Thoughts
- 📖 研究 Self-consistency
- 📖 探索 ReAct 模式

**Level 3: 系统化**
- 🔧 构建 prompt 管理框架
- 🔧 实现自动化评估
- 🔧 贡献开源项目

### 推荐资源

**论文：**
- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)
- [Few-shot Learning with Large Language Models](https://arxiv.org/abs/2301.07838)

**工具：**
- [LangChain Prompt Templates](https://python.langchain.com/docs/modules/model_io/prompts/)
- [Promptfoo](https://www.promptfoo.dev/) - Prompt 测试框架

**实践：**
- [OpenAI Cookbook - Few-shot Examples](https://github.com/openai/openai-cookbook)
- [Awesome Prompt Engineering](https://github.com/promptslab/Awesome-Prompt-Engineering)

---

## 结语

Chain of Thought 和 Few-shot Learning 是 prompt engineering 中最强大的两项技术。掌握它们，你将能够：

🎯 **解决更复杂的问题**
🚀 **更快地适应新任务**
💡 **获得更可靠的输出**
📊 **显著提升应用质量**

**记住：**
- 实践是关键 - 多尝试不同的组合
- 质量胜过数量 - 精心设计的示例更重要
- 持续优化 - 根据反馈不断改进
- 权衡成本 - 选择适合的策略

继续练习，你会逐渐发展出直觉，知道何时使用哪种技术，以及如何组合它们以获得最佳效果。

**下一篇预告：** 《Prompt 调试与优化实战》

我们将深入探讨如何系统地调试和优化 prompt，包括自动化工具、评估框架和最佳实践。敬请期待！

---

## 参考资料

- Wei, J., et al. (2022). Chain-of-Thought Prompting Elicits Reasoning in Large Language Models. NeurIPS 2022.
- Brown, T., et al. (2020). Language Models are Few-Shot Learners. NeurIPS 2020.
- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [LangChain Documentation](https://python.langchain.com/docs/)
