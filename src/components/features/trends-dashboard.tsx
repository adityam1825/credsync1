'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { claim: 'Claim A', reports: 4000 },
  { claim: 'Claim B', reports: 3000 },
  { claim: 'Claim C', reports: 2000 },
  { claim: 'Claim D', reports: 2780 },
  { claim: 'Claim E', reports: 1890 },
];

export default function TrendsDashboard() {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Misinformation Trends</CardTitle>
        <CardDescription>Top circulating unverified claims reported by the community.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
          reports: {
            label: 'Reports',
            color: 'hsl(var(--primary))',
          },
        }} className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="claim"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                width={60}
              />
              <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<ChartTooltipContent indicator="dot" />}
               />
              <Bar dataKey="reports" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
