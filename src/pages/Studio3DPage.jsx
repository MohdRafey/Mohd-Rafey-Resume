import React from 'react';
import StudioGalleryCard from '../components/StudioGalleryCard';

const projects = [
  {
    id: 'photorealism',
    taglineHeader: 'Blender • Cycles Engine • Photorealism & Shaders',
    title: 'Photorealistic Material & Product Studies',
    description: 'Explorations in photorealism created in Blender, focusing on complex glass transmission, dispersion caustics, and micro-surface metal roughness.',
    perspectives: [
      {
        id: 1,
        title: 'Study 01: Precision Ring Macro & Metal Roughness',
        tagline: 'High-detail jewelry visualization focusing on micro-facet reflections, metallic anisotropy, and studio rim lighting.',
        src: '/rings_1.png'
      },
      {
        id: 2,
        title: 'Study 02: Gemstone Dispersion & Diamond Facets',
        tagline: 'Internal refraction and prismatic dispersion study rendered with Blender Cycles ray tracing.',
        src: '/rings_2.png'
      },
      {
        id: 3,
        title: 'Study 03: Glass Refraction & Fluid Condensation',
        tagline: 'Photorealistic fluid transmission, glass fresnel falloff, and surface condensation particle simulation.',
        src: '/beer.jpg'
      }
    ]
  },
  {
    id: 'clinic',
    taglineHeader: 'Sketchup • Isometric Shading • Interior Design',
    title: '3D Dental Clinic Scene',
    description: 'A Dental clinic project that I worked on for a client using Sketchup.',
    perspectives: [
      { 
        id: 1, 
        title: 'Perspective 01: View from the Main Entrance', 
        tagline: 'Client provided its home photos and asked to create a 3D visualization of the space with complete clinic.', 
        src: '/clinic_1.jpg' 
      },
      { 
        id: 2, 
        title: 'Perspective 02: Doctor’s Consultation Room', 
        tagline: 'Spatial visualization of the consultation room with medical equipment and patient seating arrangement.', 
        src: '/clinic_2.jpg' 
      },
      { 
        id: 3, 
        title: 'Perspective 03: Complete Interior View', 
        tagline: 'A comprehensive view of the clinic’s interior, showcasing the layout and design elements.', 
        src: '/clinic_3.jpg' 
      },
      { 
        id: 4, 
        title: 'Perspective 04: Waiting Area & Reception', 
        tagline: 'A detailed look at the waiting area and reception, highlighting the design and comfort for patients.', 
        src: '/clinic_4.jpg' 
      }
    ]
  },
  {
    id: 'village',
    taglineHeader: 'Unreal Engine 4 • Real-Time Lighting • Environment Art',
    title: '3D Village Settlement Environment',
    description: 'Built this project to experiment with Unreal Engine 4’s real-time lighting, ray tracing, and volumetric fog features on my Grand father’s Village home.',
    perspectives: [
      {
        id: 1,
        title: 'Perspective 01: Rural Village Vista & Atmosphere',
        tagline: 'Real-time architectural study in Unreal Engine 4 focusing on dynamic sky lighting, foliage scattering, and rustic textures.',
        src: '/village_1.png'
      },
      {
        id: 2,
        title: 'Perspective 02: Village Settlement Layout',
        tagline: 'Detailed environmental perspective showcasing terrain height maps, material shaders, and spatial pathing.',
        src: '/village_2.png'
      }
    ]
  }
];

export default function Studio3DPage({ onNavigate }) {
  return (
    <div className="w-full flex flex-col items-center animate-fadeIn">
      {/* Top Breadcrumb Navigation */}
      <div className="w-full flex justify-between items-center mb-8">
        <button 
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900/70 border border-white/10 cursor-pointer shadow-xs transition-all hover:bg-slate-800"
        >
          ← Return to Overview
        </button>
        <span 
          className="text-xs font-bold px-3.5 py-1.5 rounded-full border shadow-xs"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'var(--accent-border-fringe)',
            color: 'var(--accent-light)'
          }}
        >
          3D Environments, Shaders &amp; Visualizations
        </span>
      </div>

      {/* Render all galleries dynamically */}
      {projects.map((project) => (
        <StudioGalleryCard
          key={project.id}
          taglineHeader={project.taglineHeader}
          title={project.title}
          description={project.description}
          perspectives={project.perspectives}
        />
      ))}
    </div>
  );
}