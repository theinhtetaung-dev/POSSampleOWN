using System.ComponentModel.DataAnnotations;

namespace YaungMel_POS.Domain.DTOs
{
    public class StockAdjustmentDTO
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }
    }

    public class PriceUpdateDTO
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        public decimal NewPrice { get; set; }
    }
}
