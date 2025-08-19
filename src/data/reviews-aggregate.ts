// Central place to keep public aggregate ratings.
// Update these numbers whenever you like, or wire them from your CMS later.
export type ReviewsAggregate = { average: number; count: number };

export const reviewsAggregate: ReviewsAggregate = {
average: 4.5,   // ⭐ average rating (e.g., 4.5)
  count: 4        // total reviews (e.g., 124)
};
