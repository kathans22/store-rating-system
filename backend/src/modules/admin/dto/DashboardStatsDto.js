class DashboardStatsDto {
  static from({ totalUsers, totalStores, totalRatings }) {
    return { totalUsers, totalStores, totalRatings };
  }
}

module.exports = DashboardStatsDto;
