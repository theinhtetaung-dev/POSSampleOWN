using YaungMel_POS.Domain.DTOs;

namespace YaungMel_POS.Domain.Features.Auth;

public interface IAuthService
{
    Task<TokenResponse?> LoginAsync(LoginRequest request);
    Task<TokenResponse?> RefreshTokenAsync(string refreshToken);
}
