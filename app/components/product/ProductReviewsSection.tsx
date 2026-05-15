// src/app/components/sections/ProductReviews.tsx

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Star, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Review {
    _id: string;
    userName: string;
    userLocation?: string;
    rating: number;
    title: string;
    comment: string;
    isVerified: boolean;
    createdAt: string;
}

interface ProductReviewsProps {
    productId: string;
}

const NAME_LIMIT = 24;
const LOCATION_LIMIT = 28;
const TITLE_LIMIT = 60;
const COMMENT_LIMIT = 145;

function limitText(value: string = "", limit: number) {
    const clean = String(value || "").trim();

    if (clean.length <= limit) return clean;

    return `${clean.slice(0, limit).trim()}...`;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        userName: "",
        userLocation: "",
        rating: 5,
        title: "",
        comment: "",
    });

    useEffect(() => {
        fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    const fetchReviews = async () => {
        if (!productId) {
            setLoading(false);
            setReviews([]);
            return;
        }
        try {
            const res = await fetch(`/api/reviews?productId=${productId}`);
            const data = await res.json();

            if (Array.isArray(data)) {
                setReviews(data);
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            const payload = {
                ...formData,
                productId,
                userName: formData.userName.trim(),
                userLocation: formData.userLocation.trim(),
                title: formData.title.trim(),
                comment: formData.comment.trim(),
            };

            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setShowForm(false);
                setFormData({
                    userName: "",
                    userLocation: "",
                    rating: 5,
                    title: "",
                    comment: "",
                });
                fetchReviews();
            }
        } catch (error) {
            console.error("Failed to submit review:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const stats = useMemo(() => {
        if (reviews.length === 0) {
            return {
                avg: 0,
                count: 0,
                distribution: [0, 0, 0, 0, 0],
            };
        }

        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        const dist = [0, 0, 0, 0, 0];

        reviews.forEach((review) => {
            if (review.rating >= 1 && review.rating <= 5) {
                dist[review.rating - 1]++;
            }
        });

        return {
            avg: Number((total / reviews.length).toFixed(1)),
            count: reviews.length,
            distribution: [...dist].reverse(),
        };
    }, [reviews]);

    const maxRatingCount = Math.max(...stats.distribution, 1);

    if (loading) {
        return (
            <section className="w-full bg-white">
                <div className="mx-auto w-full max-w-[1800px] px-[54px] py-[70px] text-center max-[768px]:px-4">
                    <div className="text-[13px] font-normal tracking-[0.12em] text-[#999999]">
                        Loading reviews...
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full bg-white">
            <style jsx global>{`
        .product-reviews-swiper {
          padding-bottom: 0 !important;
        }

        .product-reviews-swiper .swiper-wrapper {
          align-items: stretch;
        }

        .product-reviews-swiper .swiper-button-prev,
        .product-reviews-swiper .swiper-button-next {
          display: none !important;
        }

        .product-reviews-swiper .swiper-pagination {
          display: none !important;
        }
      `}</style>

            <div className="mx-auto w-full max-w-[1800px] px-[54px] pb-[58px] pt-[52px] max-[1100px]:px-[32px] max-[768px]:px-4 max-[768px]:pt-[38px]">
                <div className="flex items-center justify-between gap-[20px] max-[640px]:items-start">
                    <h2 className="font-[var(--font-sf-pro)] text-[48px] font-medium leading-none tracking-[-1px] text-black max-[768px]:text-[38px] max-[480px]:text-[32px]">
                        Product Reviews
                    </h2>

                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="h-[36px] min-w-[140px] rounded-full bg-black px-[28px] text-[12px] font-normal text-white transition-all duration-300 hover:bg-[#222] active:scale-[0.98] max-[480px]:min-w-[115px] max-[480px]:px-[18px]"
                    >
                        Add Review
                    </button>
                </div>

                <div className="mt-[32px] rounded-[10px] border border-dashed border-[#d7d7d7] px-[58px] py-[38px] max-[900px]:px-[28px] max-[640px]:px-[18px]">
                    <div className="grid grid-cols-[250px_1fr] items-center gap-[50px] max-[900px]:grid-cols-1 max-[900px]:gap-[28px]">
                        <div className="flex items-center justify-center gap-[14px] max-[900px]:justify-start">
                            <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full border-[3px] border-[#ff9f2f] text-[17px] font-normal text-black">
                                {stats.avg ? stats.avg.toFixed(1) : "0.0"}
                            </div>

                            <div>
                                <div className="flex items-center gap-[4px] text-[#ff9f2f]">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={18}
                                            strokeWidth={1.5}
                                            fill={
                                                star <= Math.round(stats.avg)
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />
                                    ))}
                                </div>

                                <p className="mt-[8px] text-[14px] font-normal text-[#555555]">
                                    from {stats.count.toLocaleString()} reviews
                                </p>
                            </div>
                        </div>

                        <div className="space-y-[16px]">
                            {stats.distribution.map((count, index) => {
                                const rating = 5 - index;
                                const percent = (count / maxRatingCount) * 100;

                                return (
                                    <div
                                        key={rating}
                                        className="grid grid-cols-[42px_18px_1fr_48px] items-center gap-[8px]"
                                    >
                                        <span className="text-[14px] font-normal text-black">
                                            {rating.toFixed(1)}
                                        </span>

                                        <Star
                                            size={13}
                                            strokeWidth={1.5}
                                            fill="currentColor"
                                            className="text-[#ff9f2f]"
                                        />

                                        <div className="h-[5px] overflow-hidden rounded-full bg-[#e9edf2]">
                                            <div
                                                className="h-full rounded-full bg-[#2b2b2b]"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>

                                        <span className="text-right text-[14px] font-normal text-black">
                                            {count.toLocaleString()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {reviews.length > 0 && (
                    <div className="mt-[28px] overflow-hidden">
                        <Swiper
                            modules={[FreeMode, Navigation, Pagination, A11y]}
                            freeMode
                            grabCursor
                            slidesPerView="auto"
                            spaceBetween={28}
                            navigation
                            pagination={{ clickable: true }}
                            className="product-reviews-swiper !overflow-visible"
                        >
                            {reviews.map((review) => {
                                const title = limitText(review.title, TITLE_LIMIT);
                                const comment = limitText(review.comment, COMMENT_LIMIT);
                                const name = limitText(review.userName, NAME_LIMIT);
                                const location = limitText(
                                    review.userLocation || "Verified Buyer",
                                    LOCATION_LIMIT
                                );

                                return (
                                    <SwiperSlide
                                        key={review._id}
                                        className="!w-[360px] max-[480px]:!w-[310px]"
                                    >
                                        <article className="h-[185px] overflow-hidden rounded-[8px] border border-[#bdbdbd] bg-white px-[24px] py-[22px]">
                                            <div className="flex items-center gap-[4px] text-[#ff9f2f]">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={17}
                                                        strokeWidth={1.5}
                                                        fill={
                                                            star <= review.rating ? "currentColor" : "none"
                                                        }
                                                    />
                                                ))}
                                            </div>

                                            <p className="mt-[16px] min-h-[44px] text-[13px] font-normal leading-[1.45] text-[#555555]">
                                                &quot;{comment || title}&quot;
                                            </p>

                                            <div className="mt-[16px]">
                                                <h3 className="truncate text-[15px] font-normal leading-[1.2] text-black">
                                                    {name}
                                                </h3>

                                                <p className="mt-[8px] truncate text-[11px] font-normal leading-none text-black">
                                                    {location}
                                                </p>
                                            </div>
                                        </article>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                )}

                {reviews.length === 0 && (
                    <div className="mt-[28px] rounded-[8px] border border-[#d7d7d7] px-6 py-12 text-center">
                        <p className="text-[15px] font-normal text-[#555555]">
                            No reviews yet.
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowForm(true)}
                            className="mt-5 h-[36px] min-w-[150px] rounded-full bg-black px-[28px] text-[12px] font-normal text-white transition-all duration-300 hover:bg-[#222]"
                        >
                            Add First Review
                        </button>
                    </div>
                )}
            </div>

            {showForm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 px-4">
                    <div className="w-full max-w-[520px] rounded-[18px] bg-white p-[24px] shadow-[0_20px_80px_rgba(0,0,0,0.25)] max-[480px]:p-[18px]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-[26px] font-normal leading-none tracking-[-0.5px] text-black">
                                    Add Review
                                </h3>
                                <p className="mt-[8px] text-[13px] font-normal leading-[1.4] text-[#666666]">
                                    Share your experience with this product.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#f2f2f2] text-black transition hover:bg-black hover:text-white"
                                aria-label="Close review form"
                            >
                                <X size={17} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-[22px]">
                            <label className="block text-[13px] font-normal text-black">
                                Rating
                            </label>

                            <div className="mt-[8px] flex items-center gap-[6px] text-[#ff9f2f]">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className="transition-transform hover:scale-110"
                                        aria-label={`${star} star rating`}
                                    >
                                        <Star
                                            size={24}
                                            strokeWidth={1.5}
                                            fill={star <= formData.rating ? "currentColor" : "none"}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div className="mt-[18px] grid grid-cols-2 gap-[14px] max-[520px]:grid-cols-1">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="block text-[13px] font-normal text-black">
                                            Name
                                        </label>
                                        <span className="text-[11px] text-[#777777]">
                                            {formData.userName.length}/{NAME_LIMIT}
                                        </span>
                                    </div>

                                    <input
                                        required
                                        type="text"
                                        value={formData.userName}
                                        maxLength={NAME_LIMIT}
                                        onChange={(event) =>
                                            setFormData({
                                                ...formData,
                                                userName: event.target.value.slice(0, NAME_LIMIT),
                                            })
                                        }
                                        className="mt-[8px] h-[42px] w-full rounded-[8px] border border-[#d7d7d7] px-[12px] text-[14px] outline-none transition focus:border-black"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="block text-[13px] font-normal text-black">
                                            Location
                                        </label>
                                        <span className="text-[11px] text-[#777777]">
                                            {formData.userLocation.length}/{LOCATION_LIMIT}
                                        </span>
                                    </div>

                                    <input
                                        type="text"
                                        value={formData.userLocation}
                                        maxLength={LOCATION_LIMIT}
                                        onChange={(event) =>
                                            setFormData({
                                                ...formData,
                                                userLocation: event.target.value.slice(
                                                    0,
                                                    LOCATION_LIMIT
                                                ),
                                            })
                                        }
                                        className="mt-[8px] h-[42px] w-full rounded-[8px] border border-[#d7d7d7] px-[12px] text-[14px] outline-none transition focus:border-black"
                                        placeholder="City, Country"
                                    />
                                </div>
                            </div>

                            <div className="mt-[14px]">
                                <div className="flex items-center justify-between">
                                    <label className="block text-[13px] font-normal text-black">
                                        Review Title
                                    </label>
                                    <span className="text-[11px] text-[#777777]">
                                        {formData.title.length}/{TITLE_LIMIT}
                                    </span>
                                </div>

                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    maxLength={TITLE_LIMIT}
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            title: event.target.value.slice(0, TITLE_LIMIT),
                                        })
                                    }
                                    className="mt-[8px] h-[42px] w-full rounded-[8px] border border-[#d7d7d7] px-[12px] text-[14px] outline-none transition focus:border-black"
                                    placeholder="Short title"
                                />
                            </div>

                            <div className="mt-[14px]">
                                <div className="flex items-center justify-between">
                                    <label className="block text-[13px] font-normal text-black">
                                        Review
                                    </label>
                                    <span className="text-[11px] text-[#777777]">
                                        {formData.comment.length}/{COMMENT_LIMIT}
                                    </span>
                                </div>

                                <textarea
                                    required
                                    rows={4}
                                    value={formData.comment}
                                    maxLength={COMMENT_LIMIT}
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            comment: event.target.value.slice(0, COMMENT_LIMIT),
                                        })
                                    }
                                    className="mt-[8px] w-full resize-none rounded-[8px] border border-[#d7d7d7] px-[12px] py-[10px] text-[14px] leading-[1.45] outline-none transition focus:border-black"
                                    placeholder="Write your review"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-[20px] h-[44px] w-full rounded-full bg-black text-[13px] font-normal text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}