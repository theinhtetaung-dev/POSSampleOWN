using CloudinaryDotNet.Actions;


namespace YaungMel_POS.Domain.Features.ProductsCatalog
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> UploadPhotoAsync(Stream photoStream, string fileName);

        Task<DeletionResult> DeletePhotoAsync(string publicId);
    }
}
