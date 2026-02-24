import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllBooks, type Book } from '../hooks/useQueries';

const LOGO_PATH = '/assets/Brown_Retro_Book_Store_Logo_20260224_180351_0000-removebg-preview.png';

const GENRES = ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy', 'Biography', 'History'];

export default function BooksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'price'>('popularity');
  const [showFilters, setShowFilters] = useState(false);

  const { data: books = [], isLoading } = useGetAllBooks();

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenres([]);
    setPriceRange([0, 100]);
    setSortBy('popularity');
  };

  // Client-side filtering and sorting
  const filteredBooks: Book[] = books
    .filter((book) => {
      const matchesSearch =
        searchTerm === '' ||
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authorName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(book.genre);
      const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1];
      return matchesSearch && matchesGenre && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      } else if (sortBy === 'price') {
        return a.price - b.price;
      }
      return 0;
    });

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div
        className="relative h-[400px] md:h-[500px] bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-banner.dim_1920x600.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <img
            src={LOGO_PATH}
            alt="Lit~Heaven open book logo"
            className="h-24 w-24 md:h-32 md:w-32 mb-6 object-contain"
          />
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome to Lit~Heaven
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            Your digital sanctuary for books, reviews, and literary community
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search books by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 md:w-auto"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Genre Filter */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Genre</Label>
                    <div className="space-y-2">
                      {GENRES.map((genre) => (
                        <div key={genre} className="flex items-center space-x-2">
                          <Checkbox
                            id={genre}
                            checked={selectedGenres.includes(genre)}
                            onCheckedChange={() => toggleGenre(genre)}
                          />
                          <label
                            htmlFor={genre}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {genre}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </Label>
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mt-4"
                    />
                  </div>

                  {/* Sort By */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Sort By</Label>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popularity">Popularity</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Books Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl font-bold">
              {filteredBooks.length} {filteredBooks.length === 1 ? 'Book' : 'Books'} Found
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-[300px] w-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No books found matching your criteria.</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  const coverUrl = book.coverImage ? book.coverImage.getDirectURL() : '/assets/generated/book-placeholder.dim_400x600.png';

  return (
    <Card className="group overflow-hidden hover:shadow-warm transition-shadow duration-300">
      <div className="relative overflow-hidden">
        <img
          src={coverUrl}
          alt={book.title}
          className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {book.bookType && (
            <Badge variant="secondary" className="text-xs capitalize">
              {book.bookType}
            </Badge>
          )}
          {!book.approved && (
            <Badge variant="outline" className="text-xs bg-background/80">
              Pending
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-serif font-semibold text-base leading-tight mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{book.authorName}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary">${book.price.toFixed(2)}</span>
          {book.rating !== undefined && book.rating !== null && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              ★ {book.rating.toFixed(1)}
            </span>
          )}
        </div>
        {book.genre && (
          <Badge variant="outline" className="mt-2 text-xs">
            {book.genre}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
