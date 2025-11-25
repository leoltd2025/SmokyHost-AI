import React, { useState, useEffect } from 'react';
import { OperationTask, SmartDevice } from '../types';
import { optimizeOperationsSchedule, analyzeDeviceTelemetry } from '../services/geminiService';
import { 
  CalendarClock, 
  CheckCircle2, 
  AlertTriangle, 
  Thermometer, 
  Wifi, 
  Droplets, 
  Lock, 
  Battery, 
  Cpu,
  RotateCcw,
  Wrench
} from 'lucide-react';

const mockTasks: OperationTask[] = [
  { id: '1', propertyId: '1', propertyName: 'Bear Hug Cabin', taskName: 'Turnover Cleaning', type: 'Cleaning', status: 'Unassigned', dueDate: '2023-10-24T11:00:00', priority: 'High' },
  { id: '2', propertyId: '2', propertyName: 'Smoky Retreat', taskName: 'Fix Loose Railing', type: 'Maintenance', status: 'Scheduled', dueDate: '2023-10-25T14:00:00', assignee: 'Tech Mike', priority: 'Medium' },
  { id: '3', propertyId: '3', propertyName: 'Dollywood Haven', taskName: 'HVAC Filter Change', type: 'Maintenance', status: 'Unassigned', dueDate: '2023-10-26T10:00:00', priority: 'Low' },
  { id: '4', propertyId: '1', propertyName: 'Bear Hug Cabin', taskName: 'Hot Tub Chemical Check', type: 'Inspection', status: 'Unassigned', dueDate: '2023-10-24T10:00:00', priority: 'High' },
];

const mockDevices: SmartDevice[] = [
  { id: 'd1', propertyId: '1', type: 'Thermostat', name: 'Living Room Nest', status: 'Online', value: '72°F', batteryLevel: 90, lastUpdate: new Date() },
  { id: 'd2', propertyId: '1', type: 'Lock', name: 'Front Door Yale', status: 'Online', value: 'Locked', batteryLevel: 45, lastUpdate: new Date() },
  { id: 'd3', propertyId: '2', type: 'LeakSensor', name: 'Basement Water', status: 'Alert', value: 'Moisture Detected', batteryLevel: 88, lastUpdate: new Date() },
  { id: 'd4', propertyId: '3', type: 'Thermostat', name: 'Main Floor EcoBee', status: 'Offline', value: '--', batteryLevel: 0, lastUpdate: new Date(Date.now() - 86400000) },
];

const OperationsView: React.FC = () => {
  const [tasks, setTasks] = useState<OperationTask[]>(mockTasks);
  const [devices] = useState<SmartDevice[]>(mockDevices);
  const [schedulePlan, setSchedulePlan] = useState<string>("");
  const [deviceAlert, setDeviceAlert] = useState<string>("Scanning telemetry...");
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    const runDiagnostics = async () => {
      const alert = await analyzeDeviceTelemetry(devices);
      setDeviceAlert(alert);
    };
    runDiagnostics();
  }, [devices]);

  const handleAutoSchedule = async () => {
    setIsOptimizing(true);
    const plan = await optimizeOperationsSchedule(tasks.filter(t => t.status === 'Unassigned'));
    setSchedulePlan(plan);
    
    // Simulate AI assigning tasks
    setTimeout(() => {
      setTasks(prev => prev.map(t => {
        if (t.status === 'Unassigned') {
            return {
                ...t,
                status: 'Scheduled',
                assignee: t.type === 'Cleaning' ? 'Cleaner A' : 'Tech Mike'
            };
        }
        return t;
      }));
      setIsOptimizing(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Scheduled': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
        case 'High': return <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">High Priority</span>;
        case 'Medium': return <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">Medium</span>;
        default: return null;
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Operations Center</h2>
            <p className="text-slate-500 text-sm">Automated Scheduling & Smart Asset Monitoring</p>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm text-sm font-medium transition-colors">
                <RotateCcw className="w-4 h-4" /> Sync TurnoverBnB
            </button>
            <button 
                onClick={handleAutoSchedule}
                disabled={isOptimizing}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md text-sm font-medium transition-all disabled:opacity-70"
            >
                {isOptimizing ? <Cpu className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                AI Auto-Schedule
            </button>
        </div>
      </div>

      {/* Smart Home Telemetry */}
      <section>
        <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-slate-800 text-lg">Smart Home Health</h3>
            {deviceAlert.includes("Alert") || deviceAlert.includes("Issue") || deviceAlert.includes("detected") ? (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold animate-pulse">Action Required</span>
            ) : (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Systems Nominal</span>
            )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* AI Insight Card */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Cpu className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-indigo-300">
                        <Cpu className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">AI Diagnostics</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-200">
                        {deviceAlert}
                    </p>
                </div>
            </div>

            {devices.map((device) => {
                const isAlert = device.status === 'Alert' || device.status === 'Offline';
                return (
                    <div key={device.id} className={`bg-white p-4 rounded-xl border shadow-sm transition-all ${isAlert ? 'border-red-200 shadow-red-100 ring-1 ring-red-100' : 'border-slate-200'}`}>
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2 rounded-lg ${
                                device.type === 'Thermostat' ? 'bg-orange-100 text-orange-600' :
                                device.type === 'Lock' ? 'bg-blue-100 text-blue-600' :
                                'bg-cyan-100 text-cyan-600'
                            }`}>
                                {device.type === 'Thermostat' && <Thermometer className="w-5 h-5" />}
                                {device.type === 'Lock' && <Lock className="w-5 h-5" />}
                                {device.type === 'LeakSensor' && <Droplets className="w-5 h-5" />}
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                                device.status === 'Online' ? 'bg-green-100 text-green-700' :
                                device.status === 'Offline' ? 'bg-slate-100 text-slate-500' :
                                'bg-red-100 text-red-600'
                            }`}>
                                {device.status === 'Offline' ? <Wifi className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>}
                                {device.status}
                            </div>
                        </div>
                        <h4 className="font-semibold text-slate-800 text-sm">{device.name}</h4>
                        <div className="flex justify-between items-end mt-2">
                            <span className="text-xl font-bold text-slate-900">{device.value}</span>
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                <Battery className={`w-3 h-3 ${device.batteryLevel < 20 ? 'text-red-500' : 'text-slate-400'}`} />
                                {device.batteryLevel}%
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </section>

      {/* Task Scheduler */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h3 className="font-bold text-slate-800 text-lg">Task Schedule</h3>
                <p className="text-sm text-slate-500">Synced with TurnoverBnB & Booking Calendar</p>
            </div>
            {schedulePlan && (
                <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm border border-indigo-100 flex items-start gap-2 max-w-lg">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{schedulePlan}</span>
                </div>
            )}
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                        <th className="px-6 py-3">Task</th>
                        <th className="px-6 py-3">Property</th>
                        <th className="px-6 py-3">Due By</th>
                        <th className="px-6 py-3">Assignee</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-md ${task.type === 'Cleaning' ? 'bg-teal-50 text-teal-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {task.type === 'Cleaning' ? <CalendarClock className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900">{task.taskName}</div>
                                        <div className="mt-1">{getPriorityBadge(task.priority)}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-700">{task.propertyName}</td>
                            <td className="px-6 py-4 text-slate-600">
                                {new Date(task.dueDate).toLocaleDateString()} <span className="text-slate-400">at</span> {new Date(task.dueDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                            </td>
                            <td className="px-6 py-4">
                                {task.assignee ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xs font-bold">
                                            {task.assignee.charAt(0)}
                                        </div>
                                        <span className="text-slate-700">{task.assignee}</span>
                                    </div>
                                ) : (
                                    <span className="text-slate-400 italic">Unassigned</span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </section>
    </div>
  );
};

export default OperationsView;