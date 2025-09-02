import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, MessageCircle, Star, Search, Plus, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProviderProfile {
  id: string;
  display_name: string;
  bio: string;
  phone_number: string;
  whatsapp_number: string;
  city: string;
  profile_image_url: string;
  is_verified: boolean;
}

const zimbabweCities = [
  'All Cities', 'Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Epworth',
  'Gweru', 'Kwekwe', 'Kadoma', 'Chegutu', 'Norton', 'Marondera',
  'Chinhoyi', 'Masvingo', 'Zvishavane', 'Bindura', 'Beitbridge',
  'Redcliff', 'Victoria Falls', 'Hwange', 'Chiredzi', 'Kariba'
];

const Index = () => {
  const { user, signOut, loading } = useAuth();
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [loadingProviders, setLoadingProviders] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('subscription_status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoadingProviders(false);
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'All Cities' || provider.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Zimbabwe Vibes
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Social Guides Platform
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/dashboard">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild className="bg-gradient-to-r from-primary to-primary/80">
                    <Link to="/auth">
                      <Plus className="h-4 w-4 mr-2" />
                      Join Now
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing{' '}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Social Guides
            </span>
            <br />in Zimbabwe
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect with professional social guides and personal hosts across all cities in Zimbabwe. 
            Find the perfect companion for your social events, tours, and experiences.
          </p>
          
          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, bio, or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="md:w-48 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {zimbabweCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Providers Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-3xl font-bold mb-2">Featured Social Guides</h3>
              <p className="text-muted-foreground">
                {filteredProviders.length} professional guides available
              </p>
            </div>
          </div>

          {loadingProviders ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="w-16 h-16 bg-muted rounded-full mb-4"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">No guides found</h3>
              <p className="text-muted-foreground mb-8">
                Try adjusting your search criteria or check back later for new guides.
              </p>
              {!user && (
                <Button asChild className="bg-gradient-to-r from-primary to-primary/80">
                  <Link to="/auth">
                    <Plus className="h-4 w-4 mr-2" />
                    Become a Guide
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProviders.map((provider) => (
                <Card key={provider.id} className="hover:shadow-lg transition-shadow duration-300 border-0 bg-card/95 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {provider.display_name}
                            {provider.is_verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {provider.city}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                      {provider.bio || "Professional social guide available for various occasions."}
                    </p>
                    <div className="flex gap-2">
                      {provider.phone_number && (
                        <Button size="sm" variant="outline" className="flex-1" asChild>
                          <a href={`tel:${provider.phone_number}`}>
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </a>
                        </Button>
                      )}
                      {provider.whatsapp_number && (
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" asChild>
                          <a 
                            href={`https://wa.me/${provider.whatsapp_number.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            WhatsApp
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our platform today. Connect with amazing people, build lasting relationships, 
            and create unforgettable experiences across Zimbabwe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-primary to-primary/80 px-8">
              <Link to="/auth">
                <User className="h-5 w-5 mr-2" />
                Find a Guide
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth">
                <Plus className="h-5 w-5 mr-2" />
                Become a Guide
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Zimbabwe Vibes
            </h4>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Connecting people across Zimbabwe for authentic social experiences and meaningful connections.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <span>© 2024 Zimbabwe Vibes</span>
              <span>•</span>
              <span>Professional Social Guides Platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
