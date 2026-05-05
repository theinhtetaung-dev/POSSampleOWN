using System.Security.Claims;
using YaungMel_POS.Database.Models;

namespace YaungMel_POS.Domain.Features.Auth;

public interface ITokenService
{
    string GenerateAccessToken(Tbl_User user);
    string GenerateRefreshToken();
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}
