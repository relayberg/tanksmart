import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, UserPlus, LogIn } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, login, register, checkRegistrationEnabled } = useAdminAuth();
  
  const [isRegistration, setIsRegistration] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/admin/dashboard');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const checkReg = async () => {
      const enabled = await checkRegistrationEnabled();
      setRegistrationEnabled(enabled);
      setIsRegistration(enabled);
      setCheckingRegistration(false);
    };
    checkReg();
  }, [checkRegistrationEnabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isRegistration) {
      if (password !== confirmPassword) {
        setError('Passwörter stimmen nicht überein');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Passwort muss mindestens 6 Zeichen lang sein');
        setIsLoading(false);
        return;
      }

      if (username.length < 3) {
        setError('Benutzername muss mindestens 3 Zeichen lang sein');
        setIsLoading(false);
        return;
      }

      const result = await register(username, password);
      if (result.error) {
        setError(result.error);
      } else {
        navigate('/admin/dashboard');
      }
    } else {
      const result = await login(username, password);
      if (result.error) {
        setError(result.error);
      } else {
        navigate('/admin/dashboard');
      }
    }

    setIsLoading(false);
  };

  if (authLoading || checkingRegistration) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">TS</span>
          </div>
          <CardTitle className="text-2xl">
            {isRegistration ? 'Admin-Registrierung' : 'Admin-Login'}
          </CardTitle>
          <CardDescription>
            {isRegistration
              ? 'Erstellen Sie den ersten Admin-Account. Diese Registrierung ist nur einmal möglich.'
              : 'Melden Sie sich mit Ihren Admin-Zugangsdaten an.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Benutzername</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                minLength={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {isRegistration && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isRegistration ? (
                <UserPlus className="mr-2 h-4 w-4" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              {isRegistration ? 'Registrieren' : 'Anmelden'}
            </Button>

            {!registrationEnabled && (
              <p className="text-center text-sm text-muted-foreground">
                Sie haben noch keinen Account?{' '}
                <span className="text-muted-foreground">
                  Die Registrierung ist deaktiviert.
                </span>
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
