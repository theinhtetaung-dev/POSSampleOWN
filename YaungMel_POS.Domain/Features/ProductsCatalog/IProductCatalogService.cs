using YaungMel_POS.Domain.DTOs;
using YaungMel_POS.Shared.Responses;

namespace YaungMel_POS.Domain.Features.ProductsCatalog
{
    public interface IProductCatalogService
    {
        Task<Result<ProductListResponseDTO>> GetProductsAsync(int pageNo, int pageSize);

        Task<Result<ProductDTO>> GetProductByIdAsync(int id);
        Task<Result<List<ProductDTO>>> GetAvailableProductsAsync();
        Task<Result<ProductDTO>> CreateProductAsync(CreateProductDTO request, int userId);
        Task<Result<ProductDTO>> CreateProductWithPhotoAsync(CreateProductDTO request, Stream photoStream, string fileName, int userId);
        Task<Result<List<ProductDTO>>> BulkCreateProductsAsync(List<CreateProductDTO> request, int userId);
        Task<Result<ProductDTO>> UpdateProductAsync(int id, UpdateProductDTO request, Stream photoStream, string fileName, int userId);
        Task<Result<bool>> DeleteProductAsync(int id, uint version, int userId);
        Task<Result<List<ProductDTO>>> GetProductsByTermAsync(string term);

        Task<Result<CategoryDTO>> GetCategoryByIdAsync(int id);
        Task<Result<CategoryListResponseModel>> GetCategoriesAsync(int pageNo, int pageSize);

        Task<Result<CategoryDTO>> CreateCategoryAsync(CreateCategoryDTO request, int userId);
        Task<Result<CategoryDTO>> UpdateCategoryAsync(int id, UpdateCategoryDTO request, int userId);
        Task<Result<List<CategoryDTO>>> GetCategoriesByTermAsync(string term);
        Task<Result<bool>> DeleteCategoryAsync(int id, int userId);
    }
}
