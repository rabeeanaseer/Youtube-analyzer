import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompareChannels, useFindChannels, getFindChannelsQueryKey } from "@workspace/api-client-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, Plus, X, BarChart2, Users, Eye, Activity, Clock } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip as RechartsTooltip, BarChart, CartesianGrid, XAxis, YAxis, Bar, Cell } from "recharts";

const COLORS = ["#ff2d55", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Compare() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const { data: searchResults, isLoading: isSearching } = useFindChannels(
    { q: debouncedQuery, maxResults: 5 },
    {
      query: {
        enabled: debouncedQuery.length > 0,
        queryKey: getFindChannelsQueryKey({ q: debouncedQuery, maxResults: 5 })
      }
    }
  );

  const compareMutation = useCompareChannels();

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) return;
    if (selectedIds.length >= 5) return;
    setSelectedIds([...selectedIds, id]);
    setQuery("");
  };

  const handleRemove = (id: string) => {
    setSelectedIds(selectedIds.filter(x => x !== id));
  };

  const handleCompare = () => {
    if (selectedIds.length < 2) return;
    compareMutation.mutate({ data: { channelIds: selectedIds } });
  };

  const comparisonData = compareMutation.data;

  // Prepare radar data
  const radarData = comparisonData ? [
    { metric: "Engagement", ...comparisonData.reduce((acc, curr) => ({ ...acc, [curr.title]: curr.avgEngagementRate }), {}) },
    { metric: "Avg Views", ...comparisonData.reduce((acc, curr) => ({ ...acc, [curr.title]: curr.avgViews }), {}) },
    { metric: "Video Count", ...comparisonData.reduce((acc, curr) => ({ ...acc, [curr.title]: curr.videoCount }), {}) },
    { metric: "Subscribers", ...comparisonData.reduce((acc, curr) => ({ ...acc, [curr.title]: curr.subscriberCount }), {}) },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compare Channels</h1>
          <p className="text-muted-foreground mt-2">Benchmark up to 5 channels side by side.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6 lg:col-span-1">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary" />
                Select Channels ({selectedIds.length}/5)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search to add..."
                  className="pl-9 bg-background"
                  disabled={selectedIds.length >= 5}
                />
              </div>

              {query && (
                <div className="border border-border rounded-md bg-background overflow-hidden">
                  {isSearching ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">Searching...</div>
                  ) : searchResults?.length ? (
                    <div className="divide-y divide-border">
                      {searchResults.map(channel => (
                        <button
                          key={channel.id}
                          onClick={() => handleSelect(channel.id)}
                          disabled={selectedIds.includes(channel.id)}
                          className="w-full flex items-center justify-between p-3 text-left hover:bg-muted transition-colors disabled:opacity-50"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <img src={channel.thumbnailUrl} alt="" className="w-8 h-8 rounded-full bg-card" />
                            <span className="font-medium text-sm truncate">{channel.title}</span>
                          </div>
                          <Plus className="w-4 h-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-muted-foreground text-center">No results</div>
                  )}
                </div>
              )}

              {selectedIds.length > 0 && (
                <div className="space-y-2 pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Selected</h4>
                  {selectedIds.map((id, index) => {
                    // Try to find the name from comparison data or search results (rough fallback)
                    const title = comparisonData?.find(c => c.channelId === id)?.title || searchResults?.find(c => c.id === id)?.title || id;
                    return (
                      <div key={id} className="flex items-center justify-between p-2 rounded bg-muted border border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span className="text-sm font-medium truncate max-w-[150px]">{title}</span>
                        </div>
                        <button onClick={() => handleRemove(id)} className="text-muted-foreground hover:text-destructive">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              <Button 
                onClick={handleCompare} 
                disabled={selectedIds.length < 2 || compareMutation.isPending}
                className="w-full mt-4"
              >
                {compareMutation.isPending ? "Comparing..." : "Generate Comparison"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!comparisonData ? (
            <div className="h-[400px] flex items-center justify-center border border-border border-dashed rounded-xl bg-card/50">
              <div className="text-center">
                <BarChart2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium">No Data Yet</h3>
                <p className="text-muted-foreground mt-1">Select at least 2 channels and generate a comparison.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {comparisonData.map((channel, i) => (
                  <Card key={channel.channelId} className="bg-card border-border overflow-hidden">
                    <div className="h-1 w-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <img src={channel.thumbnailUrl} alt="" className="w-10 h-10 rounded-full" />
                        <h4 className="font-semibold text-sm truncate">{channel.title}</h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3"/> Subs</p>
                          <p className="font-mono font-medium">{formatNumber(channel.subscriberCount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Eye className="w-3 h-3"/> Avg Views</p>
                          <p className="font-mono font-medium">{formatNumber(channel.avgViews)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Activity className="w-3 h-3"/> Engagement</p>
                          <p className="font-mono font-medium">{(channel.avgEngagementRate * 100).toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3"/> Avg Length</p>
                          <p className="font-mono font-medium">{formatDuration(channel.avgDurationSeconds)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground font-medium">Metric Balance</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: '8px' }}
                        />
                        {comparisonData.map((channel, i) => (
                          <Radar
                            key={channel.title}
                            name={channel.title}
                            dataKey={channel.title}
                            stroke={COLORS[i % COLORS.length]}
                            fill={COLORS[i % COLORS.length]}
                            fillOpacity={0.3}
                          />
                        ))}
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground font-medium">Average Views Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="title" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis 
                          tickFormatter={(val) => formatNumber(val)} 
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <RechartsTooltip 
                          formatter={(value: number) => formatNumber(value)}
                          contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: '8px' }}
                        />
                        <Bar dataKey="avgViews" radius={[4, 4, 0, 0]}>
                          {comparisonData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
