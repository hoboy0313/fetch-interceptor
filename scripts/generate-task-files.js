import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取tasks.json文件
const tasksFilePath = path.join(__dirname, '../tasks/tasks.json');
const tasksDir = path.join(__dirname, '../tasks');

try {
  const tasksData = JSON.parse(fs.readFileSync(tasksFilePath, 'utf8'));

  // 确保tasks目录存在
  if (!fs.existsSync(tasksDir)) {
    fs.mkdirSync(tasksDir, {recursive: true});
  }

  // 为每个任务创建单独的文件
  tasksData.tasks.forEach(task => {
    const taskFilePath = path.join(tasksDir, `task-${task.id}.md`);

    // 构建任务内容
    let taskContent = `# ${task.title}\n\n`;
    taskContent += `## 描述\n${task.description}\n\n`;
    taskContent += `## 详细信息\n${task.details}\n\n`;
    taskContent += `## 状态\n${task.status}\n\n`;
    taskContent += `## 优先级\n${task.priority}\n\n`;
    taskContent += `## 测试策略\n${task.testStrategy}\n\n`;

    // 添加依赖关系（如果有）
    if (task.dependencies && task.dependencies.length > 0) {
      taskContent += `## 依赖任务\n`;
      task.dependencies.forEach(depId => {
        const depTask = tasksData.tasks.find(t => t.id === depId);
        taskContent += `- [${depId}] ${depTask ? depTask.title : '未知任务'}\n`;
      });
      taskContent += '\n';
    }

    // 添加子任务（如果有）
    if (task.subtasks && task.subtasks.length > 0) {
      taskContent += `## 子任务\n`;
      task.subtasks.forEach(subtask => {
        taskContent += `- ${subtask.title}\n`;
      });
      taskContent += '\n';
    }

    // 写入文件
    fs.writeFileSync(taskFilePath, taskContent, 'utf8');
    console.info(`已生成任务文件: ${taskFilePath}`);
  });

  console.info('所有任务文件生成完毕！');
} catch (error) {
  console.error('生成任务文件时出错:', error);
}
