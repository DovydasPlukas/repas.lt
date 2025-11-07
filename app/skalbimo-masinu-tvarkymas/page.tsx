"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SaklbimoMasiniuTvarkymasPage = () => {
  const [specialRequirements, setSpecialRequirements] = React.useState("");
  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);


  // Temporary data - will be replaced with admin-managed data later
  const additionalServices = [
    { id: '1', name: 'Keisti garsai iš skalbimo mašinos'},
    { id: '2', name: '...'},
    { id: '3', name: '...'},
    { id: '4', name: '...'},
    { id: '5', name: '...' },
  ];


  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(serviceId => serviceId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Skalbimo mašinų tvarkymas</h1>
        
        <div className="space-y-6">
          {/* Special Requirements */}
          <Card className="p-6">
            <h2 className="text-xl text-[--RepasBlue] font-semibold mb-4">Aprašymas</h2>
            <textarea
              className="w-full min-h-[80px] p-3 border rounded-md border-blue-300"
              placeholder="Įveskite skalbimo mašinos problemas ir apie skambimo mašiną..."
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
            />
          </Card>

          {/* Additional Services */}
          <Card className="p-6">
            <h2 className="text-xl text-[--RepasBlue] font-semibold mb-4">Problemos (nebūtina)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {additionalServices.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all text-[--RepasBlue] ${
                    selectedServices.includes(service.id)
                      ? 'border-[--RepasBlue] bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <div className="flex justify-between items-center">
                    <span>{service.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Add Button */}
      <div className="px-4 pt-4 pb-8 xl:pb-12 xl:pt-6 w-full flex justify-center z-20">
        <Button 
          className="h-[60px] w-full max-w-[343px] sm:max-w-[608px] lg:max-w-[913px] 2xl:max-w-[1234px] p-2 rounded-lg text-center font-poppins text-base font-semibold leading-[24px] transition-all duration-300 ease-in-out bg-[--RepasBlue] hover:bg-[#5f61ab] text-white hover:text-red-600"
          onClick={() => {

            console.log({
              specialRequirements,
              selectedServices
            });
          }}
        >
          Iškviesti Meistrą
        </Button>
      </div>
    </div>
  );
};

export default SaklbimoMasiniuTvarkymasPage