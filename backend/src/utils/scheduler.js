// Scheduler implementations: FCFS, SJF (non-preemptive), RR (preemptive)
function fcfs(processes) {
  const procs = processes
    .map(p => ({ ...p, arrival: Number(p.arrival), burst: Number(p.burst) }))
    .sort((a, b) => a.arrival - b.arrival);

  let time = 0;
  const gantt = [];
  const results = procs.map(p => ({ pid: p.pid, arrival: p.arrival, burst: p.burst }));

  for (const p of procs) {
    const start = Math.max(time, p.arrival);
    const end = start + p.burst;
    const waiting = start - p.arrival;
    const turnaround = end - p.arrival;
    time = end;
    gantt.push({ pid: p.pid, start, end });
    const r = results.find(x => x.pid === p.pid);
    r.start = start; r.end = end; r.waiting = waiting; r.turnaround = turnaround;
  }

  const avgWaiting = average(results.map(r => r.waiting));
  const avgTurnaround = average(results.map(r => r.turnaround));
  return { processes: results, avgWaiting, avgTurnaround, gantt };
}

function sjf(processes) {
  const procs = processes.map(p => ({ ...p, arrival: Number(p.arrival), burst: Number(p.burst) }));
  const results = procs.map(p => ({ pid: p.pid, arrival: p.arrival, burst: p.burst }));

  let time = 0;
  const gantt = [];
  const remaining = procs.slice();

  while (remaining.length) {
    const available = remaining.filter(p => p.arrival <= time);
    let next;
    if (available.length === 0) {
      // jump to next arrival
      const nextArrival = Math.min(...remaining.map(r => r.arrival));
      time = nextArrival;
      continue;
    } else {
      available.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival);
      next = available[0];
    }

    const start = Math.max(time, next.arrival);
    const end = start + next.burst;
    const waiting = start - next.arrival;
    const turnaround = end - next.arrival;
    time = end;
    gantt.push({ pid: next.pid, start, end });
    const r = results.find(x => x.pid === next.pid);
    r.start = start; r.end = end; r.waiting = waiting; r.turnaround = turnaround;
    const idx = remaining.findIndex(p => p.pid === next.pid && p.arrival === next.arrival);
    if (idx >= 0) remaining.splice(idx, 1);
  }

  const avgWaiting = average(results.map(r => r.waiting));
  const avgTurnaround = average(results.map(r => r.turnaround));
  return { processes: results, avgWaiting, avgTurnaround, gantt };
}

function rr(processes, quantum = 2) {
  const procs = processes.map(p => ({ ...p, arrival: Number(p.arrival), burst: Number(p.burst), remaining: Number(p.burst) }));
  const results = procs.map(p => ({ pid: p.pid, arrival: p.arrival, burst: p.burst }));

  let time = 0;
  const queue = [];
  const gantt = [];
  const arrived = [...procs].sort((a,b)=>a.arrival-b.arrival);

  while (arrived.length || queue.length) {
    while (arrived.length && arrived[0].arrival <= time) queue.push(arrived.shift());

    if (queue.length === 0) {
      // advance time
      time = arrived[0].arrival;
      continue;
    }

    const p = queue.shift();
    const slice = Math.min(quantum, p.remaining);
    const start = time;
    const end = start + slice;
    p.remaining -= slice;
    time = end;
    gantt.push({ pid: p.pid, start, end });

    // push newly arrived during this slice
    while (arrived.length && arrived[0].arrival <= time) queue.push(arrived.shift());

    if (p.remaining > 0) queue.push(p);
    else {
      const finish = time;
      const r = results.find(x => x.pid === p.pid);
      r.start = r.start ?? null; // may have multiple segments
      r.end = finish; r.turnaround = finish - p.arrival; r.waiting = r.turnaround - p.burst;
    }
  }

  // For processes that finished earlier and may not have waiting set
  results.forEach(r => {
    if (r.waiting === undefined) r.waiting = 0;
    if (r.turnaround === undefined) r.turnaround = r.burst;
  });

  const avgWaiting = average(results.map(r => r.waiting));
  const avgTurnaround = average(results.map(r => r.turnaround));
  return { processes: results, avgWaiting, avgTurnaround, gantt };
}

function average(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a,b)=>a+b,0)/arr.length;
}

exports.run = ({ algorithm, processes, quantum }) => {
  if (!Array.isArray(processes) || processes.length === 0) throw new Error('No processes provided');
  switch (algorithm) {
    case 'FCFS': return fcfs(processes);
    case 'SJF': return sjf(processes);
    case 'RR': return rr(processes, Number(quantum) || 2);
    default: throw new Error('Unknown algorithm');
  }
};
