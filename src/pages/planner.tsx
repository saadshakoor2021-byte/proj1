import React, { useEffect, useState } from 'react';
import { loadTasks, saveTasks } from '../lib/storage';
import type { ApplicationStatus, ApplicationTask } from '../lib/types';
import { Button, Card, Input, Section, Select } from '../ui';

const SAMPLE_TASKS: ApplicationTask[] = [
  {
    id: 't1',
    university: 'University of the Punjab',
    program: 'BS Computer Science',
    country: 'Pakistan',
    intake: 'Fall 2025',
    deadline: 'July 15, 2025',
    status: 'researching',
    documents: ['Intermediate result card', 'Equivalence certificate', 'CNIC'],
    tests: [],
    notes: 'Apply early for merit scholarship consideration',
  },
  {
    id: 't2',
    university: 'NED University',
    program: 'BS Software Engineering',
    country: 'Pakistan',
    intake: 'Fall 2025',
    deadline: 'July 31, 2025',
    status: 'preparing',
    documents: ['Intermediate result card', 'Equivalence certificate', 'CNIC', 'SAT scorecard'],
    tests: ['SAT'],
    notes: 'SAT preparation needed',
  },
  {
    id: 't3',
    university: 'University of Karachi',
    program: 'BS Electrical Engineering',
    country: 'Pakistan',
    intake: 'Fall 2025',
    deadline: 'August 10, 2025',
    status: 'considering',
    documents: [],
    tests: [],
    notes: 'Checking eligibility requirements',
  },
  {
    id: 't4',
    university: 'University of Europe',
    program: 'BS Computer Science',
    country: 'Germany',
    intake: 'Fall 2025',
    deadline: 'July 15, 2025',
    status: 'researching',
    documents: ['Degree certificates', 'Transcripts', 'Letter of motivation', 'CV'],
    tests: ['IELTS'],
    scholarshipDeadline: 'June 1, 2025',
    notes: 'DAAD scholarship application separate',
  },
  {
    id: 't5',
    university: 'COMSATS University',
    program: 'BS Computer Science',
    country: 'Pakistan',
    intake: 'Fall 2025',
    deadline: 'August 15, 2025',
    status: 'ready',
    documents: ['Intermediate result card', 'Equivalence certificate', 'CNIC'],
    tests: [],
    notes: 'Ready to apply - all documents ready',
  },
];

const emptyTask = (): Omit<ApplicationTask, 'id'> => ({
  university: '',
  program: '',
  country: '',
  intake: '',
  deadline: '',
  status: 'considering',
  documents: [],
  tests: [],
});

const STATUS_OPTIONS = [
  { label: 'Considering', value: 'considering' },
  { label: 'Researching', value: 'researching' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Ready', value: 'ready' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Decision', value: 'decision' },
];

export function ApplicationPlanner() {
  const [tasks, setTasks] = useState<ApplicationTask[]>(() => {
    const stored = loadTasks();
    return stored.length > 0 ? stored : SAMPLE_TASKS;
  });
  const [newTask, setNewTask] = useState(emptyTask);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const filteredTasks = filterStatus === 'all' ? tasks : tasks.filter((task) => task.status === filterStatus);

  const addTask = () => {
    if (!newTask.university.trim() || !newTask.program.trim()) return;
    setTasks([...tasks, { ...newTask, id: Date.now().toString() }]);
    setNewTask(emptyTask());
  };

  return (
    <div>
      <Section>
        <h1 className="mb-4 text-3xl font-bold tracking-tight">Application Planner</h1>
        <p className="mb-6 text-muted-foreground">Track your applications, deadlines, and required documents in one place.</p>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-6">
          <Input placeholder="University" value={newTask.university} onChange={(event) => setNewTask({ ...newTask, university: event.target.value })} />
          <Input placeholder="Program" value={newTask.program} onChange={(event) => setNewTask({ ...newTask, program: event.target.value })} />
          <Input placeholder="Country" value={newTask.country} onChange={(event) => setNewTask({ ...newTask, country: event.target.value })} />
          <Input placeholder="Intake" value={newTask.intake} onChange={(event) => setNewTask({ ...newTask, intake: event.target.value })} />
          <Input placeholder="Deadline" value={newTask.deadline} onChange={(event) => setNewTask({ ...newTask, deadline: event.target.value })} />
          <Select
            options={STATUS_OPTIONS}
            value={newTask.status}
            onChange={(value) => setNewTask({ ...newTask, status: value as ApplicationStatus })}
          />
        </div>
        <Button variant="primary" onClick={addTask}>Add Application</Button>

        <div className="mt-4 max-w-xs">
          <Select
            options={[{ label: 'All statuses', value: 'all' }, ...STATUS_OPTIONS]}
            value={filterStatus}
            onChange={setFilterStatus}
          />
        </div>

        <div className="mt-6 grid gap-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <p className="text-muted-foreground">No applications yet. Add your first application above.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <Card key={task.id} className="p-4">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium">{task.university} — {task.program}</h3>
                      <p className="text-sm text-muted-foreground">{task.country}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      task.status === 'ready' ? 'bg-primary/10 text-primary' :
                      task.status === 'submitted' ? 'bg-green-100 text-green-800' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="mb-2 text-sm text-muted-foreground">
                    <div>Deadline: {task.deadline}</div>
                    <div>Intake: {task.intake}</div>
                  </div>
                  <Select
                    options={STATUS_OPTIONS}
                    value={task.status}
                    onChange={(value) => setTasks(tasks.map((item) => item.id === task.id ? { ...item, status: value as ApplicationStatus } : item))}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">Documents: {task.documents.length ? task.documents.join(', ') : 'None listed'}</p>
                  <p className="text-xs text-muted-foreground">Tests: {task.tests.length ? task.tests.join(', ') : 'None'}</p>
                  {task.notes && <p className="mt-2 text-xs italic text-muted-foreground">{task.notes}</p>}
                  <Button variant="link" className="mt-2 text-destructive" onClick={() => setTasks(tasks.filter((item) => item.id !== task.id))}>
                    Remove
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

export default ApplicationPlanner;
