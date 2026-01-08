import { Layout } from "@/components/Layout";
import { FloatingParticles } from "@/components/FloatingParticles";
import { Shield, Database, Eye, Lock, Users, Globe, Mail } from "lucide-react";
import logoHero from "@/assets/logo-hero.png";
const PolitiqueConfidentialite = () => {
  return <Layout>
      <FloatingParticles />
      
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-violet/10 via-transparent to-transparent" />
        <div className="absolute inset-0 grid-bg" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8 flex justify-center opacity-0 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-neon-violet/50 blur-[60px] rounded-full scale-110 animate-pulse-glow" />
                <img src={logoHero} alt="IMPARTIAL" className="relative w-24 h-24 drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]" />
              </div>
            </div>
            
            <div className="mb-6 flex justify-center opacity-0 animate-fade-in" style={{
            animationDelay: "0.1s"
          }}>
              <div className="badge-gradient flex items-center gap-2 text-sm font-medium text-violet-300">
                Protection des données
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 opacity-0 animate-fade-in-up" style={{
            animationDelay: "0.2s"
          }}>
              Politique de <span className="text-gradient-neon">confidentialité</span>
            </h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-in-up" style={{
            animationDelay: "0.3s"
          }}>
              Comment nous protégeons vos données personnelles
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Introduction */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-neon-violet/20 border border-neon-violet/30">
                  <Shield className="h-6 w-6 text-neon-violet" />
                </div>
                <h2 className="text-2xl font-bold">Introduction</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  IMPARTIAL Studio s'engage à protéger la vie privée des utilisateurs de son site web. Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
                </p>
                <p>
                  En utilisant notre site, vous acceptez les pratiques décrites dans cette politique de confidentialité.
                </p>
              </div>
            </div>

            {/* Responsable du traitement */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                  <Users className="h-6 w-6 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold">Responsable du traitement</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p><span className="font-semibold text-foreground">Raison sociale :</span> Impartial Games </p>
                <p><span className="font-semibold text-foreground">Adresse :</span> Delaware, États-Unis   </p>
                <p><span className="font-semibold text-foreground">Email :</span> contact@impartialgames.com</p>
                
              </div>
            </div>

            {/* Données collectées */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                  <Database className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold">Données collectées</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>Nous pouvons collecter les types de données suivants :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><span className="font-semibold text-foreground">Données d'identification :</span> nom, prénom, adresse email, numéro de téléphone</li>
                  <li><span className="font-semibold text-foreground">Données professionnelles :</span> nom de l'entreprise, fonction, secteur d'activité</li>
                  <li><span className="font-semibold text-foreground">Données de navigation :</span> adresse IP, type de navigateur, pages visitées, durée de visite</li>
                  <li><span className="font-semibold text-foreground">Données de communication :</span> contenu des messages envoyés via le formulaire de contact</li>
                </ul>
              </div>
            </div>

            {/* Finalités du traitement */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30">
                  <Eye className="h-6 w-6 text-rose-400" />
                </div>
                <h2 className="text-2xl font-bold">Finalités du traitement</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>Vos données personnelles sont collectées et traitées pour les finalités suivantes :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Répondre à vos demandes de contact et de devis</li>
                  <li>Vous fournir nos services de création digitale</li>
                  <li>Gérer notre relation commerciale</li>
                  <li>Améliorer notre site web et nos services</li>
                  <li>Vous envoyer notre newsletter (avec votre consentement)</li>
                  <li>Respecter nos obligations légales et réglementaires</li>
                </ul>
              </div>
            </div>

            {/* Base légale */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Base légale du traitement</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>Le traitement de vos données personnelles repose sur les bases légales suivantes :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><span className="font-semibold text-foreground">Votre consentement :</span> pour l'envoi de newsletters et communications marketing</li>
                  <li><span className="font-semibold text-foreground">L'exécution d'un contrat :</span> pour la fourniture de nos services</li>
                  <li><span className="font-semibold text-foreground">Notre intérêt légitime :</span> pour améliorer nos services et notre site web</li>
                  <li><span className="font-semibold text-foreground">Nos obligations légales :</span> pour respecter la réglementation applicable</li>
                </ul>
              </div>
            </div>

            {/* Durée de conservation */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Durée de conservation</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>Vos données personnelles sont conservées pendant une durée limitée :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><span className="font-semibold text-foreground">Données de contact :</span> 3 ans après le dernier contact</li>
                  <li><span className="font-semibold text-foreground">Données clients :</span> 5 ans après la fin de la relation commerciale</li>
                  <li><span className="font-semibold text-foreground">Données de navigation :</span> 13 mois maximum</li>
                  <li><span className="font-semibold text-foreground">Données de facturation :</span> 10 ans (obligation légale)</li>
                </ul>
              </div>
            </div>

            {/* Sécurité des données */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-violet-500/20 border border-violet-500/30">
                  <Lock className="h-6 w-6 text-violet-400" />
                </div>
                <h2 className="text-2xl font-bold">Sécurité des données</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre la destruction, la perte, l'altération, la divulgation ou l'accès non autorisé.
                </p>
                <p>Ces mesures incluent notamment :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Le chiffrement des données sensibles</li>
                  <li>L'utilisation de connexions sécurisées (HTTPS)</li>
                  <li>La limitation de l'accès aux données aux seules personnes autorisées</li>
                  <li>Des sauvegardes régulières</li>
                </ul>
              </div>
            </div>

            {/* Partage des données */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30">
                  <Globe className="h-6 w-6 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold">Partage des données</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Nous ne vendons ni ne louons vos données personnelles à des tiers. Vos données peuvent être partagées uniquement avec :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Nos sous-traitants (hébergeur, outils d'analyse) qui agissent selon nos instructions</li>
                  <li>Les autorités compétentes lorsque la loi l'exige</li>
                </ul>
                <p>
                  Tout transfert de données en dehors de l'Union Européenne est encadré par des garanties appropriées.
                </p>
              </div>
            </div>

            {/* Vos droits */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Vos droits</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><span className="font-semibold text-foreground">Droit d'accès :</span> obtenir une copie de vos données</li>
                  <li><span className="font-semibold text-foreground">Droit de rectification :</span> corriger des données inexactes</li>
                  <li><span className="font-semibold text-foreground">Droit à l'effacement :</span> demander la suppression de vos données</li>
                  <li><span className="font-semibold text-foreground">Droit à la limitation :</span> limiter le traitement de vos données</li>
                  <li><span className="font-semibold text-foreground">Droit à la portabilité :</span> recevoir vos données dans un format structuré</li>
                  <li><span className="font-semibold text-foreground">Droit d'opposition :</span> vous opposer au traitement de vos données</li>
                  <li><span className="font-semibold text-foreground">Droit de retirer votre consentement :</span> à tout moment</li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30">
                  <Mail className="h-6 w-6 text-rose-400" />
                </div>
                <h2 className="text-2xl font-bold">Exercer vos droits</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Pour exercer vos droits ou pour toute question relative à la protection de vos données personnelles, vous pouvez nous contacter :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><span className="font-semibold text-foreground">Par email :</span>Par email : contact@impartialgames.com</li>
                  <li><span className="font-semibold text-foreground">Par courrier :</span> Impartial Games, Delaware    </li>
                </ul>
                <p>
                  Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) si vous estimez que le traitement de vos données ne respecte pas la réglementation applicable.
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Cookies</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Notre site utilise des cookies pour améliorer votre expérience de navigation. Pour plus d'informations sur notre utilisation des cookies, veuillez consulter notre <a href="/cookies" className="text-neon-violet hover:underline">politique de cookies</a>.
                </p>
              </div>
            </div>

            {/* Modifications */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Modifications de la politique</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec une date de mise à jour. Nous vous encourageons à consulter régulièrement cette page pour rester informé de nos pratiques en matière de protection des données.
                </p>
              </div>
            </div>

            {/* Mise à jour */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Dernière mise à jour : Décembre 2025</p>
            </div>

          </div>
        </div>
      </section>
    </Layout>;
};
export default PolitiqueConfidentialite;