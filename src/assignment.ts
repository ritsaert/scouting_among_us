
export type Task = { 
    task: string; 
    location: string; 
    all: boolean;
    used: number; 
  };
  
export function createAssignments(tasks: Task[], attendees: number, taskCount: number) {
    const result: Task[][] = [];
    for (let i = 0; i < attendees; i++) {
      const selectedTasks: Task[] = [];
      for (let j = 0; j < taskCount; j++) {
        const locations = selectedTasks.map(task => task.location);
        const possibleTasks = tasks.filter((task) => locations.indexOf(task.location) === -1 && !task.all);
        const used = Math.min(...possibleTasks.map(task => task.used));
        const candidates = possibleTasks.filter(task => task.used === used);
        const candidate = candidates[Math.floor(Math.random() * candidates.length)];
        selectedTasks.push(candidate);
        candidate.used++;
      }
      for (const task of tasks) if (task.all) selectedTasks.push(task);
      selectedTasks.sort((_a, _b) => Math.random() - 0.5);
      result.push(selectedTasks);
    }
    return result;
  }
  