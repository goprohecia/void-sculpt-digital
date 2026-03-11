import { Layout } from "@/components/Layout";
import { Building2, Shield, Server } from "lucide-react";
import logoMba from "@/assets/logo-mba.png";

const MentionsLegales = () => {
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
              Mentions <span className="font-medium text-gradient-neon">légales</span>
            </h1>
            <p className="text-xl text-gray-600">
              Conformément aux dispositions légales en vigueur
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 relative bg-white">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* Éditeur du site */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
                  <Building2 className="h-6 w-6 text-[#22c55e]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Éditeur du site</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p><span className="font-semibold text-gray-900">Raison sociale :</span> Impartial Games</p>
                <p><span className="font-semibold text-gray-900">Forme juridique :</span> C corp</p>
                <p><span className="font-semibold text-gray-900">Siège social :</span> Delaware, États-Unis</p>
              </div>
            </div>

            {/* Directeur de publication */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
                  <Shield className="h-6 w-6 text-[#22c55e]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Directeur de la publication</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p><span className="font-semibold text-gray-900">Nom :</span> Yannis Bizriche</p>
                <p><span className="font-semibold text-gray-900">Qualité :</span> Président</p>
              </div>
            </div>

            {/* Hébergeur */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
                  <Server className="h-6 w-6 text-[#22c55e]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Hébergement</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p><span className="font-semibold text-gray-900">Hébergeur :</span> IONOS SARL</p>
                <p><span className="font-semibold text-gray-900">Adresse :</span> 7, place de la Gare, BP 70109, 57200 Sarreguemines Cedex, France</p>
                <p><span className="font-semibold text-gray-900">Site web :</span> ionos.fr</p>
              </div>
            </div>

            {/* Propriété intellectuelle */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Propriété intellectuelle</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
                <p>La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.</p>
                <p>Les marques et logos figurant sur ce site sont des marques déposées. Toute reproduction totale ou partielle de ces marques ou de ces logos, effectuée à partir des éléments du site sans l'autorisation expresse de MY BUSINESS ASSISTANT est donc prohibée.</p>
              </div>
            </div>

            {/* Données personnelles */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Protection des données personnelles</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.</p>
                <p>Pour exercer ces droits ou pour toute question relative à la protection de vos données personnelles, vous pouvez nous contacter à l'adresse suivante : contact@mybusinessassistant.com</p>
                <p>Pour plus d'informations sur la gestion de vos données personnelles, veuillez consulter notre politique de confidentialité.</p>
              </div>
            </div>

            {/* Limitation de responsabilité */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Limitation de responsabilité</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>MY BUSINESS ASSISTANT s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur ce site. Cependant, MY BUSINESS ASSISTANT ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.</p>
                <p>En conséquence, MY BUSINESS ASSISTANT décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur ce site.</p>
                <p>MY BUSINESS ASSISTANT ne saurait être tenu responsable des dommages directs ou indirects résultant de l'accès ou de l'utilisation du site.</p>
              </div>
            </div>

            {/* Liens hypertextes */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Liens hypertextes</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Le site peut contenir des liens hypertextes vers d'autres sites. MY BUSINESS ASSISTANT n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.</p>
                <p>La création de liens hypertextes vers le site mybusinessassistant.com est soumise à l'accord préalable du directeur de la publication.</p>
              </div>
            </div>

            {/* Droit applicable */}
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Droit applicable et juridiction compétente</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.</p>
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
export default MentionsLegales;
