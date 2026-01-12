import Link from 'next/link'
import { Target, CheckCircle, XCircle, AlertTriangle, Clock, Activity } from 'lucide-react'

interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'down' | 'unknown'
  latency?: number
  message?: string
}

async function checkServices(): Promise<ServiceStatus[]> {
  const services: ServiceStatus[] = []
  
  // Check API health
  try {
    const start = Date.now()
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/health`, {
      cache: 'no-store',
    })
    const latency = Date.now() - start
    
    if (response.ok) {
      const data = await response.json()
      services.push({
        name: 'API Server',
        status: 'operational',
        latency,
        message: `Version ${data.version}`,
      })
      
      // Check sub-services from health response
      if (data.services) {
        services.push({
          name: 'AI Service (Anthropic)',
          status: data.services.anthropic === 'configured' ? 'operational' : 'down',
          message: data.services.anthropic === 'configured' ? 'Connected' : 'API key not configured',
        })
        
        services.push({
          name: 'Rate Limiting',
          status: data.services.rateLimit === 'upstash' ? 'operational' : 'degraded',
          message: data.services.rateLimit === 'upstash' ? 'Distributed (Upstash)' : 'In-memory fallback',
        })
      }
    } else {
      services.push({
        name: 'API Server',
        status: 'degraded',
        latency,
        message: `HTTP ${response.status}`,
      })
    }
  } catch (error) {
    services.push({
      name: 'API Server',
      status: 'down',
      message: 'Unable to connect',
    })
  }
  
  // Static service entries
  services.push({
    name: 'Web Application',
    status: 'operational',
    message: 'This page loaded successfully',
  })
  
  services.push({
    name: 'Data Storage',
    status: 'operational',
    message: 'Browser localStorage (client-side)',
  })
  
  return services
}

function getOverallStatus(services: ServiceStatus[]): 'operational' | 'degraded' | 'down' {
  const hasDown = services.some(s => s.status === 'down')
  const hasDegraded = services.some(s => s.status === 'degraded')
  
  if (hasDown) return 'down'
  if (hasDegraded) return 'degraded'
  return 'operational'
}

function StatusIcon({ status }: { status: ServiceStatus['status'] }) {
  switch (status) {
    case 'operational':
      return <CheckCircle className="w-5 h-5 text-green-500" />
    case 'degraded':
      return <AlertTriangle className="w-5 h-5 text-amber-500" />
    case 'down':
      return <XCircle className="w-5 h-5 text-red-500" />
    default:
      return <Clock className="w-5 h-5 text-stone-400" />
  }
}

function StatusBadge({ status }: { status: 'operational' | 'degraded' | 'down' }) {
  const colors = {
    operational: 'bg-green-100 text-green-700 border-green-200',
    degraded: 'bg-amber-100 text-amber-700 border-amber-200',
    down: 'bg-red-100 text-red-700 border-red-200',
  }
  
  const labels = {
    operational: 'All Systems Operational',
    degraded: 'Partial System Outage',
    down: 'Major System Outage',
  }
  
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${colors[status]}`}>
      <StatusIcon status={status} />
      <span className="font-medium">{labels[status]}</span>
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StatusPage() {
  const services = await checkServices()
  const overallStatus = getOverallStatus(services)
  const lastChecked = new Date().toISOString()
  
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sage-400 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-stone-700">Life Strategy</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <Activity className="w-4 h-4" />
            <span>System Status</span>
          </div>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Overall Status */}
        <div className="text-center mb-12">
          <StatusBadge status={overallStatus} />
          <p className="text-sm text-stone-500 mt-4">
            Last checked: {new Date(lastChecked).toLocaleString()}
          </p>
        </div>
        
        {/* Services List */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200">
            <h2 className="font-semibold text-stone-800">Services</h2>
          </div>
          
          <div className="divide-y divide-stone-100">
            {services.map((service, index) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon status={service.status} />
                  <div>
                    <p className="font-medium text-stone-800">{service.name}</p>
                    {service.message && (
                      <p className="text-sm text-stone-500">{service.message}</p>
                    )}
                  </div>
                </div>
                {service.latency !== undefined && (
                  <span className="text-sm text-stone-400">{service.latency}ms</span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Incident History Placeholder */}
        <div className="mt-8 bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200">
            <h2 className="font-semibold text-stone-800">Recent Incidents</h2>
          </div>
          <div className="px-6 py-8 text-center text-stone-500">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p>No incidents reported in the last 30 days</p>
          </div>
        </div>
        
        {/* Help Links */}
        <div className="mt-8 text-center text-sm text-stone-500">
          <p>
            Having issues?{' '}
            <a href="mailto:support@example.com" className="text-sage-600 hover:underline">
              Contact support
            </a>
            {' • '}
            <Link href="/" className="text-sage-600 hover:underline">
              Return to app
            </Link>
          </p>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-8 px-6 border-t border-stone-200 bg-stone-100 mt-12">
        <div className="max-w-3xl mx-auto text-center text-sm text-stone-500">
          <p>© {new Date().getFullYear()} Life Strategy Planner</p>
        </div>
      </footer>
    </div>
  )
}
