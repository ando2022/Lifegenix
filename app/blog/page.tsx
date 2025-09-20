'use client';

import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "The Science Behind Single-Mix Smoothies",
      excerpt: "Discover why single-mix smoothies provide optimal nutrient absorption and perfect blending compared to complex layered drinks.",
      author: "Dr. Sarah Chen",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Science",
      image: "/api/placeholder/400/250"
    },
    {
      id: 2,
      title: "Creating Perfect Foam: Aquafaba vs Coconut Cream",
      excerpt: "Learn the professional techniques for creating beautiful, stable foams that enhance both taste and presentation.",
      author: "Marcus Rodriguez",
      date: "2024-01-12",
      readTime: "7 min read",
      category: "Techniques",
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "Allergy-Safe Smoothie Substitutions",
      excerpt: "Complete guide to substituting common allergens in smoothie recipes without compromising taste or nutrition.",
      author: "Dr. Sarah Chen",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "Health",
      image: "/api/placeholder/400/250"
    },
    {
      id: 4,
      title: "Mood-Based Nutrition: How Your Emotions Affect Your Needs",
      excerpt: "Explore the connection between your emotional state and nutritional requirements for optimal wellness.",
      author: "Anastasia Dobson",
      date: "2024-01-08",
      readTime: "8 min read",
      category: "Wellness",
      image: "/api/placeholder/400/250"
    },
    {
      id: 5,
      title: "Longevity Ingredients: What Really Works",
      excerpt: "Evidence-based review of ingredients that have been scientifically proven to support healthy aging and longevity.",
      author: "Dr. Sarah Chen",
      date: "2024-01-05",
      readTime: "10 min read",
      category: "Science",
      image: "/api/placeholder/400/250"
    },
    {
      id: 6,
      title: "Building Your Smoothie Business: A Café Owner's Guide",
      excerpt: "Practical tips for café owners looking to add personalized smoothies to their menu and increase revenue.",
      author: "Marcus Rodriguez",
      date: "2024-01-03",
      readTime: "12 min read",
      category: "Business",
      image: "/api/placeholder/400/250"
    }
  ];

  const categories = ["All", "Science", "Techniques", "Health", "Wellness", "Business"];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-teal-600 to-mint-500 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Xova Blog
            </h1>
            <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
              Expert insights on personalized nutrition, smoothie techniques, and wellness science
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === "All"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Article</h2>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div className="h-64 md:h-full bg-gradient-to-br from-teal-400 to-mint-500 flex items-center justify-center">
                      <span className="text-white text-6xl">🧬</span>
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-full">
                        Science
                      </span>
                      <span className="text-sm text-gray-500">Featured</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      The Science Behind Single-Mix Smoothies
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Discover why single-mix smoothies provide optimal nutrient absorption and perfect blending 
                      compared to complex layered drinks. Learn about the science of ingredient synergy and 
                      how it affects bioavailability.
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Jan 15, 2024</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>5 min read</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">By Dr. Sarah Chen</span>
                      <Link 
                        href="/blog/the-science-behind-single-mix-smoothies"
                        className="text-teal-600 hover:text-teal-700 font-medium flex items-center space-x-1"
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Articles</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(1).map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-teal-400 to-mint-500 flex items-center justify-center">
                    <span className="text-white text-4xl">
                      {post.category === "Science" && "🧬"}
                      {post.category === "Techniques" && "🥤"}
                      {post.category === "Health" && "💚"}
                      {post.category === "Wellness" && "🧘"}
                      {post.category === "Business" && "💼"}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">By {post.author}</span>
                      <Link 
                        href={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get the latest articles on personalized nutrition and smoothie science delivered to your inbox
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button className="btn-primary">
                  Subscribe
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                No spam, unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
