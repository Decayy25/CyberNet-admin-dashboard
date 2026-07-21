import React, { FC } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

interface ContactInfo {
  label: string;
  icon: React.ReactNode;
  value: string;
  href?: string;
}

const ClientFooter: FC = () => {
  const currentYear = new Date().getFullYear();

  const contactInfo: ContactInfo[] = [
    {
      label: "Telepon",
      icon: <Phone size={20} className="text-green-600" />,
      value: "+62 821 2637 6157",
      href: "https://wa.me/6282126376157?text=",
    },
    {
      label: "Email",
      icon: <Mail size={20} className="text-blue-600" />,
      value: "info@cybernet.id",
      href: "mailto:info@cybernet.id",
    },
  ];

  return (
    <footer id="kontak" className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-2">CYBERNET</h3>
          <p className="text-lg text-gray-300 mb-4">
            Harga Hemat, Internet Hebat
          </p>
          <div className="flex items-center justify-center text-gray-400 mb-8">
            <MapPin size={20} className="mr-2" />
            <p className="text-sm max-w-lg">
              Jl. H. Darham Cikopo No.132, Tenjolaya, Kec. Cicalengka, Kabupaten
              Bandung, Jawa Barat 40395
            </p>
          </div>
        </div>

        {/* Maps Section */}
        <div className="mb-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.2963941811254!2d107.84361637475757!3d-6.980264393020576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68c537471b6659%3A0x81b00c7b960ef1c8!2sCYBERNET!5e1!3m2!1sid!2sid!4v1765408235327!5m2!1sid!2sid"
            width="100%"
            height={350}
            style={{ border: 0, borderRadius: "15px" }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi CYBERNET"
          />
        </div>

        {/* Contact Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {contactInfo.map((info: ContactInfo, index: number) => (
            <a
              key={index}
              href={info.href}
              className="flex items-center justify-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
              <div>{info.icon}</div>
              <div className="text-left">
                <p className="text-xs text-gray-400">{info.label}</p>
                <p className="text-sm font-medium">{info.value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8" />

        {/* Copyright Section */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} CYBERNET. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={"https://wa.me/6282126376157?text="}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        title="Chat dengan kami di WhatsApp">
        <svg
          className="w-7 h-7"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.762 0-3.440.827-4.549 2.175C5.397 9.172 4.731 10.934 4.731 12.783c0 1.849.666 3.611 1.876 4.95 1.101 1.267 2.6 1.977 4.176 2.157 1.576.18 3.157-.203 4.336-1.067.712-.531 1.226-1.173 1.612-1.99l.094-.172.124-.254c.024-.05.048-.102.07-.155-.076-.062-.222-.19-.355-.306-.182-.15-.42-.348-.58-.461-.211-.15-.36-.224-.54-.156-.234.091-.492.36-.637.55-.233.302-.424.586-.686.847-.396.394-1.04.625-1.675.625-.636 0-1.281-.231-1.677-.625-.262-.261-.453-.545-.686-.847-.145-.19-.403-.459-.637-.55-.18-.068-.329.006-.54.156-.16.113-.398.311-.58.461-.133.116-.279.244-.355.306.022.053.046.105.07.155l.124.254.094.172c.386.817.9 1.459 1.612 1.99 1.179.864 2.76 1.247 4.336 1.067 1.576-.18 3.075-.89 4.176-2.157 1.21-1.339 1.876-3.101 1.876-4.95 0-1.849-.666-3.611-1.876-4.95C16.436 7.406 14.788 6.579 13.051 6.579z" />
        </svg>
      </a>
    </footer>
  );
};

export default ClientFooter;