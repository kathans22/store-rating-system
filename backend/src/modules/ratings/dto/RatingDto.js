class SubmitRatingDto {
  constructor({ rating }) {
    this.rating = Number(rating);
  }

  static fromRequest(body) {
    return new SubmitRatingDto(body);
  }
}

class RatingResponseDto {
  static fromEntity(rating) {
    return {
      id: rating.id,
      userId: rating.user_id,
      storeId: rating.store_id,
      rating: parseInt(rating.rating, 10),
    };
  }
}

module.exports = { SubmitRatingDto, RatingResponseDto };
