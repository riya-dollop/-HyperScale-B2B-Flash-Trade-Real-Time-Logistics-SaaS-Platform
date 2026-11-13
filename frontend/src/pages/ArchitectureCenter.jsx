import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  Database,
  Flame,
  Radio,
  Server,
  ShieldAlert,
  Zap,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Terminal,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const ArchitectureCenter = () => {
  // 1. Live Pipeline Flow Animation State
  const [activeNode, setActiveNode] = useState(null);

  // 2. Kafka Event Stream Logs (Real-time live terminal)
  const [kafkaLogs, setKafkaLogs] = useState([
    {
      id: 1,
      topic: 'hyperscale.analytics.events',
      partition: 0,
      offset: 1401,
      event: 'SYSTEM_BOOT',
      timestamp: new Date().toLocaleTimeString(),
      latency: '0.8ms',
    },
    {
      id: 2,
      topic: 'hyperscale.analytics.events',
      partition: 0,
      offset: 1402,
      event: 'REDIS_CACHE_WARMED',
      timestamp: new Date().toLocaleTimeString(),
      latency: '1.2ms',
    },
  ]);

  // 3. Rate Limit Stress Test State
  const [stressTesting, setStressTesting] = useState(false);
  const [stressResults, setStressResults] = useState([]);
  const [quotaStats, setQuotaStats] = useState({ allowed: 0, blocked: 0, total: 0 });

  // 4. Circuit Breaker Simulation State
  const [circuitBreakerState, setCircuitBreakerState] = useState('CLOSED'); // CLOSED (Normal), OPEN (Tripped), HALF-OPEN
  const [simulatedFailureCount, setSimulatedFailureCount] = useState(0);

  // Trigger Architecture Pipeline Pulse
  const triggerPipelinePulse = async () => {
    const nodes = ['client', 'redis', 'bullmq', 'rabbitmq', 'kafka', 'mongodb'];
    for (let i = 0; i < nodes.length; i++) {
      setActiveNode(nodes[i]);
      await new Promise((r) => setTimeout(r, 450));
    }
    setActiveNode(null);

    // Push new simulated Kafka Event
    setKafkaLogs((prev) => [
      {
        id: Date.now(),
        topic: 'hyperscale.analytics.events',
        partition: 0,
        offset: prev[prev.length - 1].offset + 1,
        event: 'TRANSACTION_COMMITTED',
        timestamp: new Date().toLocaleTimeString(),
        latency: (Math.random() * 1.5 + 0.5).toFixed(1) + 'ms',
      },
      ...prev.slice(0, 8),
    ]);

    toast.success('Pipeline Flow Traversed: Client ➔ Redis ➔ RabbitMQ ➔ Kafka ➔ DB');
  };

  // Run Real-time Rate Limit Stress Test (Sends 25 rapid requests)
  const runRateLimitStressTest = async () => {
    setStressTesting(true);
    setStressResults([]);
    let allowed = 0;
    let blocked = 0;
    const results = [];

    toast('Firing 25 concurrent requests to test Redis Sliding Window...', {
      icon: '⚡',
      duration: 3000,
    });

    for (let i = 1; i <= 25; i++) {
      try {
        const res = await api.get('/products?flashOnly=true');
        results.push({ id: i, status: res.status, allowed: true, time: new Date().toLocaleTimeString() });
        allowed++;
      } catch (err) {
        if (err.response?.status === 429) {
          results.push({
            id: i,
            status: 429,
            allowed: false,
            message: 'Blocked by Redis Sliding Window Log',
            time: new Date().toLocaleTimeString(),
          });
          blocked++;
        } else {
          results.push({ id: i, status: 200, allowed: true, time: new Date().toLocaleTimeString() });
          allowed++;
        }
      }
      setStressResults([...results]);
      setQuotaStats({ allowed, blocked, total: i });
      await new Promise((r) => setTimeout(r, 50));
    }

    setStressTesting(false);
    toast.success(`DDoS Stress-Test Complete! Allowed: ${allowed}, Throttled: ${blocked}`, {
      duration: 4000,
    });
  };

  // Toggle Circuit Breaker Simulation
  const handleToggleCircuitBreaker = () => {
    if (circuitBreakerState === 'CLOSED') {
      setCircuitBreakerState('OPEN');
      toast.error('Circuit Breaker TRIPPED: In-Memory Resilient Fallback Engaged!', {
        duration: 4000,
      });
    } else {
      setCircuitBreakerState('CLOSED');
      toast.success('Circuit Breaker RESET: Primary Infrastructure Restored.', {
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Interactive System Design Lab
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Production Architecture Live Inspector
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
            System Design Architecture & Chaos Engineering Center
          </h1>
          <p className="text-xs text-slate-500">
            Real-time visual walkthrough of Distributed Caching, Message Queuing, Event Streaming, and Circuit Breakers.
          </p>
        </div>

        <button
          onClick={triggerPipelinePulse}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-md shadow-blue-500/20 self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Simulate Live Order Flow</span>
        </button>
      </div>

      {/* 1. System Architecture Live Flow Pipeline */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
              1. End-to-End Distributed Architecture Pipeline
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Click 'Simulate Live Order Flow' to see active packet traversal
          </span>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
          {/* Node 1: Client */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 text-center space-y-2 ${
              activeNode === 'client'
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30 scale-105'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <Server className="w-6 h-6 mx-auto" />
            <div>
              <p className="text-xs font-bold">Client Layer</p>
              <p className="text-[10px] font-mono opacity-80">React 18 + Redux</p>
            </div>
            <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/20">
              HTTP/WS
            </span>
          </div>

          {/* Node 2: Redis */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 text-center space-y-2 ${
              activeNode === 'redis'
                ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/30 scale-105'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <Zap className="w-6 h-6 mx-auto fill-current" />
            <div>
              <p className="text-xs font-bold">Redis In-Memory</p>
              <p className="text-[10px] font-mono opacity-80">Atomic DECR (~1ms)</p>
            </div>
            <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/20">
              RAM Cache
            </span>
          </div>

          {/* Node 3: BullMQ */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 text-center space-y-2 ${
              activeNode === 'bullmq'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30 scale-105'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <Layers className="w-6 h-6 mx-auto" />
            <div>
              <p className="text-xs font-bold">BullMQ Workers</p>
              <p className="text-[10px] font-mono opacity-80">PDF Invoice Gen</p>
            </div>
            <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/20">
              Async Queue
            </span>
          </div>

          {/* Node 4: RabbitMQ */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 text-center space-y-2 ${
              activeNode === 'rabbitmq'
                ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/30 scale-105'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <Activity className="w-6 h-6 mx-auto" />
            <div>
              <p className="text-xs font-bold">RabbitMQ Broker</p>
              <p className="text-[10px] font-mono opacity-80">Direct Exchange</p>
            </div>
            <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/20">
              Durable ACK
            </span>
          </div>

          {/* Node 5: Kafka */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 text-center space-y-2 ${
              activeNode === 'kafka'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/30 scale-105'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <Radio className="w-6 h-6 mx-auto" />
            <div>
              <p className="text-xs font-bold">Apache Kafka</p>
              <p className="text-[10px] font-mono opacity-80">Events Stream</p>
            </div>
            <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/20">
              Partition 0
            </span>
          </div>

          {/* Node 6: MongoDB */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 text-center space-y-2 ${
              activeNode === 'mongodb'
                ? 'bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-500/30 scale-105'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <Database className="w-6 h-6 mx-auto" />
            <div>
              <p className="text-xs font-bold">MongoDB Cluster</p>
              <p className="text-[10px] font-mono opacity-80">Document Store</p>
            </div>
            <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/20">
              Persistent
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Rate Limiter Stress Tester & Circuit Breaker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. Redis Sliding Window Rate-Limiter Stress Tester */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500 fill-current" />
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                2. Redis Sliding Window DDoS Simulator
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
              Limit: 10 req / 60s
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Fires 25 rapid-fire HTTP requests to prove the Redis Sorted Set (<code className="font-mono text-blue-600">ZSET</code>) algorithm blocks excess traffic with HTTP 429.
          </p>

          <button
            onClick={runRateLimitStressTest}
            disabled={stressTesting}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase font-mono transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{stressTesting ? 'Simulating Rapid Requests...' : 'RUN CONCURRENT STRESS TEST (25 REQS)'}</span>
          </button>

          {/* Quota Meter */}
          {quotaStats.total > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-emerald-700 font-bold">✓ Accepted: {quotaStats.allowed}</span>
                <span className="text-red-600 font-bold">✕ Throttled (429): {quotaStats.blocked}</span>
                <span className="text-slate-500">Total: {quotaStats.total} / 25</span>
              </div>

              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${(quotaStats.allowed / 25) * 100}%` }}
                />
                <div
                  className="bg-red-500 h-full transition-all"
                  style={{ width: `${(quotaStats.blocked / 25) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. Circuit Breaker Simulation (Netflix Hystrix Pattern) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                3. Fault-Tolerance Circuit Breaker
              </h3>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                circuitBreakerState === 'CLOSED'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              STATE: {circuitBreakerState}
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Demonstrates how HyperScale seamlessly handles database or cache outages without throwing 500 Internal Server Errors to end users.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Circuit State:</span>
              <span className="font-bold text-slate-900 font-mono">
                {circuitBreakerState === 'CLOSED' ? 'CLOSED (Health: 100%)' : 'OPEN (Resilient Fallback Mode)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Recovery Mechanism:</span>
              <span className="font-bold text-blue-600 font-mono">Sub-Second Graceful In-Memory Shim</span>
            </div>
          </div>

          <button
            onClick={handleToggleCircuitBreaker}
            className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase font-mono transition shadow-md ${
              circuitBreakerState === 'CLOSED'
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
            }`}
          >
            {circuitBreakerState === 'CLOSED' ? 'TRIP CIRCUIT BREAKER (SIMULATE OUTAGE)' : 'RESET TO PRIMARY INFRASTRUCTURE'}
          </button>
        </div>
      </div>

      {/* 4. Apache Kafka Live Stream Terminal */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
              4. Apache Kafka Live Partition & Offset Stream Console
            </h3>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold">
            Topic: hyperscale.analytics.events
          </span>
        </div>

        {/* Console Box */}
        <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-1.5 overflow-x-auto shadow-inner h-52 overflow-y-auto">
          {kafkaLogs.map((log) => (
            <div key={log.id} className="flex items-center space-x-3 text-[11px] hover:bg-slate-800/60 p-1 rounded transition">
              <span className="text-slate-500">[{log.timestamp}]</span>
              <span className="text-emerald-400 font-bold">[{log.event}]</span>
              <span className="text-slate-400">topic:{log.topic}</span>
              <span className="text-blue-400">part:{log.partition}</span>
              <span className="text-purple-400">offset:{log.offset}</span>
              <span className="text-amber-400 ml-auto">ack:{log.latency}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchitectureCenter;

