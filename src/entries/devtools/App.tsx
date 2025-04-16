import {useCallback, useRef, useState} from 'react';

import {Badge} from '@/components/ui/badge';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Switch} from '@/components/ui/switch';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {HTTP_METHODS} from '@/constants/http-method';
import {cn} from '@/lib/utils';
import {useRulesStore} from '@/stores/rules';
import {Copy, Pencil, Plus, Trash2} from 'lucide-react';

import type {HttpMethod} from '@/constants/http-method';
import type {InterceptRule} from '@/stores/rules';

export default function App() {
  const {rules, updateRule, addRule, deleteRule, copyRule} = useRulesStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const isComposingRef = useRef(false);

  const toggleRule = useCallback((rule: InterceptRule) => {
    updateRule(rule.id, {
      enabled: !rule.enabled,
    });
  }, [updateRule]);

  const toggleMethod = (rule: InterceptRule, method: HttpMethod) => {
    const hasCurrentMethod = rule.methods.includes(method);
    updateRule(rule.id, {
      methods: hasCurrentMethod ? rule.methods.filter(m => m !== method) : [...rule.methods, method],
    });
  };

  const handleEdit = (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (rule) {
      setEditingId(id);
      setEditingValue(rule.description);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingValue(e.target.value);
  };

  const handleUrlBlur = () => {
    if (editingId) {
      updateRule(editingId, {
        description: editingValue,
      });
      setEditingId(null);
    }
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposingRef.current) {
      handleUrlBlur();
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleCopy = (rule: InterceptRule) => {
    const newId = copyRule(rule.id);
    handleEdit(newId);
  };

  const handleDelete = (id: string) => {
    deleteRule(id);
  };

  const handleAddRule = () => {
    const newId = addRule();
    handleEdit(newId);
  };

  return (
    <div className="h-screen w-full">
      <div className="sticky top-0 bg-white border-b z-10 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Fetch 拦截器</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50">
              v1.0.0
            </Badge>
            <Badge variant="outline" className="bg-green-50">
              最新版本
            </Badge>
          </div>
        </div>
        <button
          onClick={handleAddRule}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          添加规则
        </button>
      </div>

      <div className="p-5">
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[60%]">URL</TableHead>
                <TableHead className="w-[20%]">Method</TableHead>
                <TableHead className="w-[10%]">状态</TableHead>
                <TableHead className="w-[10%]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map(rule => (
                <TableRow key={rule.id} className="hover:bg-gray-50">
                  <TableCell
                    className="w-[60%]"
                    onDoubleClick={() => handleEdit(rule.id)}
                  >
                    {editingId === rule.id
                      ? (
                        <Input
                          value={editingValue}
                          onChange={handleUrlChange}
                          onBlur={handleUrlBlur}
                          onKeyDown={handleUrlKeyDown}
                          onCompositionStart={() => {
                            isComposingRef.current = true;
                          }}
                          onCompositionEnd={() => {
                            isComposingRef.current = false;
                          }}
                          className="w-full"
                          autoFocus
                          placeholder="请输入 URL"
                        />
                      )
                      : (
                        <span className="truncate block">{rule.description}</span>
                      )}
                  </TableCell>
                  <TableCell className="w-[20%]">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="flex flex-wrap gap-1 cursor-pointer">
                          {rule.methods
                            .map(method => (
                              <Badge
                                key={method}
                                variant="outline"
                                className="bg-blue-50 hover:bg-blue-100"
                              >
                                {method}
                              </Badge>
                            ))}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-2" side="left">
                        <div className="space-y-2">
                          {HTTP_METHODS.map(method => (
                            <label
                              key={method}
                              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                            >
                              <Checkbox
                                checked={rule.methods.includes(method)}
                                onCheckedChange={() => toggleMethod(rule, method)}
                              />
                              <span>{method}</span>
                            </label>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell className="w-[10%]">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(rule)}
                      className={cn(
                        'data-[state=checked]:bg-green-500',
                        'data-[state=unchecked]:bg-gray-200',
                      )}
                    />
                  </TableCell>
                  <TableCell className="w-[10%]">
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleEdit(rule.id)}
                              className="p-2 hover:bg-gray-100 rounded-full"
                            >
                              <Pencil className="h-4 w-4 text-gray-500" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>编辑</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleCopy(rule)}
                              className="p-2 hover:bg-gray-100 rounded-full"
                            >
                              <Copy className="h-4 w-4 text-gray-500" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>复制</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleDelete(rule.id)}
                              className="p-2 hover:bg-gray-100 rounded-full text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>删除</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
