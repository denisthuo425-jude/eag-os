"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, Activity, TrendingUp, Lightbulb } from "lucide-react";

export function PatientInsightsWidget() {
  return (
    <Card className="h-full flex flex-col bg-slate-950 border-slate-800 text-white shadow-2xl relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>
      
      <CardHeader className="border-b border-slate-800 pb-4 relative z-10">
        <CardTitle className="flex items-center space-x-2 text-slate-100">
          <Activity className="w-5 h-5 text-yellow-500" />
          <span>Patient Insights</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 flex-1 flex flex-col justify-between relative z-10 space-y-6">
        
        {/* Top Metric */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium tracking-wider uppercase">Total Seen This Month</p>
            <h3 className="text-4xl font-bold text-white mt-1">428</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Demographics */}
        <div className="space-y-4">
          <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase border-b border-slate-800 pb-2">Demographic Split</p>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Adults (60%)</span>
                <span className="text-slate-400">256</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Pediatrics (25%)</span>
                <span className="text-slate-400">107</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Corporate (15%)</span>
                <span className="text-slate-400">65</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="space-y-3">
          <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>Weekly Trend</span>
            <TrendingUp className="w-3 h-3 text-slate-500" />
          </p>
          <div className="flex items-end justify-between h-24 pt-4 px-2">
            {[
              { day: 'M', height: '40%' },
              { day: 'T', height: '90%', active: true },
              { day: 'W', height: '60%' },
              { day: 'T', height: '50%' },
              { day: 'F', height: '70%' },
              { day: 'S', height: '30%' },
            ].map((bar, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="relative w-8 flex justify-center h-20 items-end">
                  <div 
                    className={`w-6 rounded-t-sm transition-all duration-300 ${bar.active ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-slate-800 group-hover:bg-primary'}`} 
                    style={{ height: bar.height }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500 mt-2 font-medium">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Insight */}
        <div className="bg-slate-900/50 border border-yellow-500/20 rounded-xl p-4 flex items-start space-x-3">
          <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-yellow-500">Peak Footfall Alert:</strong> Highest volumes consistently observed on Tuesday mornings. Recommend increasing triage locums by 1 to maintain flow.
          </p>
        </div>

      </CardContent>
    </Card>
  );
}
