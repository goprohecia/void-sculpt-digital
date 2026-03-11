import { Layout } from "@/components/Layout";
import { Shield, Database, Eye, Lock, Users, Globe, Mail } from "lucide-react";
import logoMba from "@/assets/logo-mba.png";

const PolitiqueConfidentialite = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-white">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <img src={logoMba} alt="MBA" className="w-20 h-20" />
            </div>
            <h1 className="text-4xl md:text-5xl font-light mb-6 text-gray-900">
              Politique de <span className="font-medium text-gradient-neon">confidentialité</span>
            </h1>
            <p className="text-xl text-gray-600">
              Comment nous protégeons vos données personnelles
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 relative bg-white">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* Introduction */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
                  <Shield className="h-6 w-6 text-[#22c55e]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
              </div>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>MY BUSINESS ASSISTANT s'engage à protéger la vie privée des utilisateurs de son site web. Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.</p>
                <p>En utilisant notre site, vous acceptez les pratiques décrites dans cette politique de confidentialité.</p>
              </div>
            </div>

            {/* Responsable du traitement */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
                  <Users className="h-6 w-6 text-[#22c55e]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Responsable du traitement</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p><span className="font-semibold text-gray-900">Raison sociale :</span> Impartial Games</p>
                <p><span className="font-semibold text-gray-900">Adresse :</span> Delaware, États-Unis</p>
                <p><span className="font-semibold text-gray-900">Email :</span> contact@mybusinessassistant.com</p>
              </div>
            </div>

            {/* Données collectées */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
                  <Database className="h-6 w-6 text-[#22c55e]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Données collectées</h2>
              </div>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Nous pouvons collecter les types de données suivants :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><span className="font-semibold text-gray-900">Données d'identification :</span> nom, prénom, adresse email, numéro de téléphone</li>
                  <li><span className="font-semibold text-gray-900">Données professionnelles :</span> nom de l'entreprise, fonction, secteur d'activité</li>
                  <li><span className="font-semibold text-gray-900">Données de navigation :</span> adresse IP, type de navigateur, pages visitées, durée de visite</li>
                  <li><span className="font-semibold text-gray-900">Données de communication :</span> contenu des messages envoyés via le formulaire de contact</li>
                </ul>
              </div>
            </div>

            {/* Finalités */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
                  <Eye className="h-6 w-6 text-[#22c55e]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Finalités du traitement</h2>
              </div>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Vos données personnelles sont collectées et traitées pour les finalités suivantes :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Répondre à vos demandes de contact et de devis</li>
                  <li>Vous fournir nos services</li>
                  <li>Gérer notre relation commerciale</li>
                  <li>Améliorer notre site web et nos services</li>
                  <li>Vous envoyer notre newsletter (avec votre consentement)</li>
                  <li>Respecter nos obligations légales et réglementaires</li>
                </ul>
              </div>
            </div>

            {/* Base légale */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Base légale du traitement</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Le traitement de vos données personnelles repose sur les bases légales suivantes :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><span className="font-semibold text-gray-900">Votre consentement :</span> pour l'envoi de newsletters et communications marketing</li>
                  <li><span className="font-semibold text-gray-900">L'exécution d'un contrat :</span> pour la fourniture de nos services</li>
                  <li><span className="font-semibold text-gray-900">Notre intérêt légitime :</span> pour améliorer nos services et notre site web</li>
                  <li><span className="font-semibold text-gray-900">Nos obligations légales :</span> pour respecter la réglementation applicable</li>
                </ul>
              </div>
            </div>

            {/* Durée de conservation */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Durée de conservation</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Vos données personnelles sont conservées pendant une durée limitée :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><span className="font-semibold text-gray-900">Données de contact :</span> 3 ans après le dernier contact</li>
                  <li><span className="font-semibold text-gray-900">Données clients :</span> 5 ans après la fin de la relation commerciale</li>
                  <li><span className="font-semibold text-gray-900">Données de navigation :</span> 13 mois maximum</li>
                  <li><span className="font-semibold text-gray-900">Données de facturation :</span> 10 ans (obligation légale)</li>
                </ul>
              </div>
            </div>

            {/* Sécurité */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
                  <Lock className="h-6 w-6 text-[#22c55e]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Sécurité des données</h2>
              </div>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles.</p>
                <p>Ces mesures incluent notamment :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Le chiffrement des données sensibles</li>
                  <li>L'utilisation de connexions sécurisées (HTTPS)</li>
                  <li>La limitation de l'accès aux données aux seules personnes autorisées</li>
                  <li>Des sauvegardes régulières</li>
                </ul>
              </div>
            </div>

            {/* Partage */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
                  <Globe className="h-6 w-6 text-[#22c55e]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Partage des données</h2>
              </div>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Nous ne vendons ni ne louons vos données personnelles à des tiers. Vos données peuvent être partagées uniquement avec :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Nos sous-traitants (hébergeur, outils d'analyse) qui agissent selon nos instructions</li>
                  <li>Les autorités compétentes lorsque la loi l'exige</li>
                </ul>
                <p>Tout transfert de données en dehors de l'Union Européenne est encadré par des garanties appropriées.</p>
              </div>
            </div>

            {/* Vos droits */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Vos droits</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><span className="font-semibold text-gray-900">Droit d'accès :</span> obtenir une copie de vos données</li>
                  <li><span className="font-semibold text-gray-900">Droit de rectification :</span> corriger des données inexactes</li>
                  <li><span className="font-semibold text-gray-900">Droit à l'effacement :</span> demander la suppression de vos données</li>
                  <li><span className="font-semibold text-gray-900">Droit à la limitation :</span> limiter le traitement de vos données</li>
                  <li><span className="font-semibold text-gray-900">Droit à la portabilité :</span> recevoir vos données dans un format structuré</li>
                  <li><span className="font-semibold text-gray-900">Droit d'opposition :</span> vous opposer au traitement de vos données</li>
                  <li><span className="font-semibold text-gray-900">Droit de retirer votre consentement :</span> à tout moment</li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
                  <Mail className="h-6 w-6 text-[#22c55e]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Exercer vos droits</h2>
              </div>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Pour exercer vos droits ou pour toute question relative à la protection de vos données personnelles, vous pouvez nous contacter :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><span className="font-semibold text-gray-900">Par email :</span> contact@mybusinessassistant.com</li>
                  <li><span className="font-semibold text-gray-900">Par courrier :</span> Impartial Games, Delaware</li>
                </ul>
                <p>Vous disposez également du droit d'introduire une réclamation auprès de la CNIL si vous estimez que le traitement de vos données ne respecte pas la réglementation applicable.</p>
              </div>
            </div>

            {/* Cookies */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Cookies</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Notre site utilise des cookies pour améliorer votre expérience de navigation. Pour plus d'informations, veuillez consulter notre <a href="/cookies" className="text-[#22c55e] hover:underline">politique de cookies</a>.</p>
              </div>
            </div>

            {/* Modifications */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Modifications de la politique</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec une date de mise à jour.</p>
              </div>
            </div>

            {/* Mise à jour */}
            <div className="text-center text-sm text-gray-500">
              <p>Dernière mise à jour : Décembre 2025</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default PolitiqueConfidentialite;
