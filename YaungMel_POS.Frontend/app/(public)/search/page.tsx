"use client";

import { useEffect, useState } from "react";
import { Search as SearchIcon, Filter, RotateCcw, Boxes } from "lucide-react";
import { searchApi, categoriesApi } from "@/lib/api";
import type { CategoryDTO, ProductDTO, SearchRequestDTO, PageSettingDTO } from "@/lib/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { toast } from "@/components/ui/Toast";
import { Pagination } from "@/components/ui/Pagination";

const initialFilters: SearchRequestDTO = {
  Name: "", CategoryId: undefined, MinPrice: undefined, MaxPrice: undefined,
  MinStockQuantity: undefined, MaxStockQuantity: undefined,
  SortBy: "name", IsDescending: false, PageNumber: 1, PageSize: 20,
};

export default function SearchPage() {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [results, setResults] = useState<ProductDTO[]>([]);
  const [pageSetting, setPageSetting] = useState<PageSettingDTO>({
    pageNo: 1,
    pageSize: 20,
    pageCount: 0,
  });
  const [filters, setFilters] = useState<SearchRequestDTO>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const [categoryRes, searchRes] = await Promise.all([
          categoriesApi.getAll(),
          searchApi.search(initialFilters)
        ]);
        if (categoryRes.isSuccess && categoryRes.data) {
          const sortedCategories = [...categoryRes.data].sort((a, b) => a.name.localeCompare(b.name));
          setCategories(sortedCategories);
        }
        if (searchRes.isSuccess && searchRes.data) {
          // Safeguard: handle both array and paged object formats
          const rawData = searchRes.data as any;
          const items = Array.isArray(rawData) ? rawData : (rawData?.items || []);
          setResults(items);
          
          if (rawData?.pageSetting) {
            setPageSetting(rawData.pageSetting);
          }
        }
        else toast("error", searchRes.message || "Search failed");
      } catch (err) { 
        console.error("Load error:", err);
        toast("error", "Failed to load search tools"); 
      }
      finally { setIsLoading(false); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSearch = async (page: number = 1) => {
    if (filters.MinPrice !== undefined && filters.MaxPrice !== undefined && filters.MaxPrice < filters.MinPrice) {
      toast("error", "Max Price must be greater than or equal to Min Price");
      return;
    }

    const updatedFilters = { ...filters, PageNumber: page };
    setFilters(updatedFilters);
    setIsSearching(true);
    try {
      const res = await searchApi.search(updatedFilters);
      if (res.isSuccess && res.data) {
        const rawData = res.data as any;
        const items = Array.isArray(rawData) ? rawData : (rawData?.items || []);
        setResults(items);
        
        if (rawData?.pageSetting) {
          setPageSetting(rawData.pageSetting);
        }
      }
      else toast("error", res.message || "Search failed");
    } catch (err) { 
      console.error("Search error:", err);
      toast("error", "Search request failed"); 
    }
    finally { setIsSearching(false); }
  };

  const handleReset = async () => {
    setFilters(initialFilters);
    setIsSearching(true);
    try {
      const res = await searchApi.search(initialFilters);
      if (res.isSuccess && res.data) {
        const rawData = res.data as any;
        const items = Array.isArray(rawData) ? rawData : (rawData?.items || []);
        setResults(items);
        
        if (rawData?.pageSetting) {
          setPageSetting(rawData.pageSetting);
        }
      }
    } catch (err) { 
      console.error("Reset error:", err);
      toast("error", "Failed to reset search"); 
    }
    finally { setIsSearching(false); }
  };

  const getCategoryName = (id: number) => categories.find((c) => c.id === id)?.name || "Unknown";

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Advanced Search</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Filter products by name, category, price, and stock.</p>
        </div>

        <Card padding="lg">
          <CardHeader title="Search Filters" subtitle="Build a product query and fetch matching items." action={<Filter size={18} className="text-[var(--text-tertiary)]" />} />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Input label="Product Name" placeholder="Search by name" value={filters.Name || ""} onChange={(e) => setFilters((prev) => ({ ...prev, Name: e.target.value }))} icon={<SearchIcon size={16} />} />
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Category</label>
              <select value={filters.CategoryId ?? ""} onChange={(e) => setFilters((prev) => ({ ...prev, CategoryId: e.target.value ? Number(e.target.value) : undefined }))} className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]">
                <option value="">All Categories</option>
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <Input label="Min Price" type="number" placeholder="0" value={filters.MinPrice ?? ""} onChange={(e) => setFilters((prev) => ({ ...prev, MinPrice: e.target.value ? Number(e.target.value) : undefined }))} />
            <Input label="Max Price" type="number" placeholder="10000" value={filters.MaxPrice ?? ""} onChange={(e) => setFilters((prev) => ({ ...prev, MaxPrice: e.target.value ? Number(e.target.value) : undefined }))} />
            <Input label="Min Stock" type="number" placeholder="0" value={filters.MinStockQuantity ?? ""} onChange={(e) => setFilters((prev) => ({ ...prev, MinStockQuantity: e.target.value ? Number(e.target.value) : undefined }))} />
            <Input label="Max Stock" type="number" placeholder="100" value={filters.MaxStockQuantity ?? ""} onChange={(e) => setFilters((prev) => ({ ...prev, MaxStockQuantity: e.target.value ? Number(e.target.value) : undefined }))} />
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Sort By</label>
              <select value={filters.SortBy ?? "name"} onChange={(e) => setFilters((prev) => ({ ...prev, SortBy: e.target.value }))} className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]">
                <option value="name">Name</option><option value="price">Price</option><option value="createdDate">Created Date</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Order</label>
              <select value={filters.IsDescending ? "desc" : "asc"} onChange={(e) => setFilters((prev) => ({ ...prev, IsDescending: e.target.value === "desc" }))} className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]">
                <option value="asc">Ascending</option><option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button onClick={() => void handleSearch(1)} isLoading={isSearching} icon={<SearchIcon size={16} />}>Run Search</Button>
            <Button variant="secondary" onClick={handleReset} icon={<RotateCcw size={16} />}>Reset</Button>
          </div>
        </Card>

        <Card padding="none">
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Boxes size={18} className="text-[var(--accent-primary)]" />
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {isLoading ? "Searching..." : pageSetting.pageCount > 0 ? `Page ${pageSetting.pageNo} of ${pageSetting.pageCount}` : `${results.length} items found`}
              </p>
            </div>
            {!isLoading && pageSetting.pageCount > 1 && (
              <Pagination
                currentPage={pageSetting.pageNo}
                totalPages={pageSetting.pageCount}
                onPageChange={(page) => void handleSearch(page)}
              />
            )}
          </div>

          {isLoading ? (<div className="p-6"><SkeletonTable rows={6} /></div>) : results.length === 0 ? (
            <div className="py-16 text-center">
              <Boxes size={48} className="mx-auto mb-3 text-[var(--text-tertiary)] opacity-50" />
              <p className="text-[var(--text-secondary)]">No products matched your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                    {["No.", "Product", "Category", "Price", "Stock", "Status"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((product, index) => (
                    <tr key={product.id} className="border-b border-[var(--border-primary)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-[var(--text-tertiary)]">
                        {(pageSetting.pageNo - 1) * pageSetting.pageSize + index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{product.name}</p>
                        {product.description && <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{product.description}</p>}
                      </td>
                      <td className="py-3 px-4"><Badge variant="info">{getCategoryName(product.categoryId)}</Badge></td>
                      <td className="py-3 px-4 text-sm font-mono text-[var(--text-primary)]">{product.priceFormatted || `${product.price.toLocaleString()} MMK`}</td>
                      <td className="py-3 px-4"><Badge variant={product.stockQuantity <= 5 ? "warning" : "success"}>{product.stockQuantity}</Badge></td>
                      <td className="py-3 px-4"><Badge variant={product.isActive ? "success" : "danger"}>{product.isActive ? "Active" : "Inactive"}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Bottom Pagination */}
          {!isLoading && pageSetting.pageCount > 1 && (
            <div className="p-4 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] rounded-b-2xl">
              <Pagination
                currentPage={pageSetting.pageNo}
                totalPages={pageSetting.pageCount}
                onPageChange={(page) => void handleSearch(page)}
              />
            </div>
          )}
        </Card>
      </div>
    </AnimatedPage>
  );
}
