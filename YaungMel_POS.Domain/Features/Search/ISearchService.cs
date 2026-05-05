using YaungMel_POS.Domain.DTOs;

namespace YaungMel_POS.Domain.Features.Search
{
    public interface ISearchService
    {
        Task<List<ProductDTO>> SearchProductsAsync(SearchProductRequestDTO searchRequest);
        
        Task<List<CategoryDTO>> SearchCategoryAsync(SearchCategoryRequestDTO searchRequest);
    }
}
