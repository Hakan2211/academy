import type { ComponentProps } from 'react'
import { Lesson } from './Lesson'
import { Step } from './Step'
import { Quiz } from './Quiz'
import { Scene3D } from './Scene3D'
import { Figure } from './Figure'
import { Video } from './Video'
import { Callout } from './Callout'
import { Formula } from './Formula'
import { SineWave } from './SineWave'
import { DistanceTrack } from './DistanceTrack'
import { SpeedCompare } from './SpeedCompare'
import { KinematicsLab } from './KinematicsLab'
import { ForceDiagram } from './ForceDiagram'
import { ActionReaction } from './ActionReaction'
import { FreeFall } from './FreeFall'
import { Collision } from './Collision'
import { CircularMotion } from './CircularMotion'
import { OrbitLab } from './OrbitLab'
import { EnergySkater } from './EnergySkater'
import { WorkLab } from './WorkLab'
import { PowerRace } from './PowerRace'
import { ThermalJiggle } from './ThermalJiggle'
import { EntropyBox } from './EntropyBox'
import { WaveLab } from './WaveLab'
import { WaveType } from './WaveType'
import { PulseReflect } from './PulseReflect'
import { Refraction } from './Refraction'
import { Superposition } from './Superposition'
import { StandingWave } from './StandingWave'
import { ShadowCast } from './ShadowCast'
import { MirrorReflect } from './MirrorReflect'
import { LensRays } from './LensRays'
import { PrismDispersion } from './PrismDispersion'
import { SpectrumBar } from './SpectrumBar'
import { DoubleSlit } from './DoubleSlit'
import { StatesOfMatter } from './StatesOfMatter'
import { BuoyancyTank } from './BuoyancyTank'
import { PressureLab } from './PressureLab'
import { FluidPressure } from './FluidPressure'
import { GasPistonLab } from './GasPistonLab'
import { HeatTransfer } from './HeatTransfer'
import { PhaseChange } from './PhaseChange'
import { ChargeLab } from './ChargeLab'
import { CurrentFlow } from './CurrentFlow'
import { CircuitLab } from './CircuitLab'
import { SeriesParallel } from './SeriesParallel'
import { MagnetField } from './MagnetField'
import { WireField } from './WireField'
import { Solenoid } from './Solenoid'
import { MotorEffect } from './MotorEffect'
import { Induction } from './Induction'
import { Generator } from './Generator'
import { Transformer } from './Transformer'
import { EMWave } from './EMWave'
import { AtomBuilder } from './AtomBuilder'
import { IsotopeLab } from './IsotopeLab'
import { RadiationTypes } from './RadiationTypes'
import { HalfLifeLab } from './HalfLifeLab'
import { FissionFusion } from './FissionFusion'
import { PhotoelectricLab } from './PhotoelectricLab'
import { EnergyLevels } from './EnergyLevels'
import { ProbabilityCloud } from './ProbabilityCloud'
import { LightPostulate } from './LightPostulate'
import { LightClock } from './LightClock'
import { LengthContraction } from './LengthContraction'
import { Simultaneity } from './Simultaneity'
import { SpeedLimit } from './SpeedLimit'
import { Equivalence } from './Equivalence'
import { SpacetimeWell } from './SpacetimeWell'
import { GravityTime } from './GravityTime'
import { Seasons } from './Seasons'
import { MoonPhases } from './MoonPhases'
import { SolarSystem } from './SolarSystem'
import { StarLifeCycle } from './StarLifeCycle'
import { Parallax } from './Parallax'
import { CosmicScale } from './CosmicScale'
import { HubbleExpansion } from './HubbleExpansion'
import { BigBangTimeline } from './BigBangTimeline'
import { ScientificMethod } from './ScientificMethod'
import { UnitExplorer } from './UnitExplorer'
import { PrefixLadder } from './PrefixLadder'
import { AccuracyPrecision } from './AccuracyPrecision'
import { ProportionGraph } from './ProportionGraph'
import { CrystalLattice } from './CrystalLattice'
import { BandGap } from './BandGap'
import { Meissner } from './Meissner'
import { EarthInterior } from './EarthInterior'
import { DoublePendulum } from './DoublePendulum'
import { StandardModel } from './StandardModel'

// Injected globally via <MDXProvider> so authored .mdx can use these directly.
export const mdxComponents = {
  // Lesson engine + interactive blocks
  Lesson,
  Step,
  Quiz,
  Scene3D,
  Figure,
  Video,
  Callout,
  Formula,
  SineWave,
  DistanceTrack,
  SpeedCompare,
  KinematicsLab,
  ForceDiagram,
  ActionReaction,
  FreeFall,
  Collision,
  CircularMotion,
  OrbitLab,
  EnergySkater,
  WorkLab,
  PowerRace,
  ThermalJiggle,
  EntropyBox,
  WaveLab,
  WaveType,
  PulseReflect,
  Refraction,
  Superposition,
  StandingWave,
  ShadowCast,
  MirrorReflect,
  LensRays,
  PrismDispersion,
  SpectrumBar,
  DoubleSlit,
  StatesOfMatter,
  BuoyancyTank,
  PressureLab,
  FluidPressure,
  GasPistonLab,
  HeatTransfer,
  PhaseChange,
  ChargeLab,
  CurrentFlow,
  CircuitLab,
  SeriesParallel,
  MagnetField,
  WireField,
  Solenoid,
  MotorEffect,
  Induction,
  Generator,
  Transformer,
  EMWave,
  AtomBuilder,
  IsotopeLab,
  RadiationTypes,
  HalfLifeLab,
  FissionFusion,
  PhotoelectricLab,
  EnergyLevels,
  ProbabilityCloud,
  LightPostulate,
  LightClock,
  LengthContraction,
  Simultaneity,
  SpeedLimit,
  Equivalence,
  SpacetimeWell,
  GravityTime,
  Seasons,
  MoonPhases,
  SolarSystem,
  StarLifeCycle,
  Parallax,
  CosmicScale,
  HubbleExpansion,
  BigBangTimeline,
  ScientificMethod,
  UnitExplorer,
  PrefixLadder,
  AccuracyPrecision,
  ProportionGraph,
  CrystalLattice,
  BandGap,
  Meissner,
  EarthInterior,
  DoublePendulum,
  StandardModel,

  // Styled base elements for a polished read
  h1: (p: ComponentProps<'h1'>) => (
    <h1 className="text-3xl font-bold" {...p} />
  ),
  h2: (p: ComponentProps<'h2'>) => (
    <h2 className="mt-2 text-2xl font-bold" {...p} />
  ),
  h3: (p: ComponentProps<'h3'>) => (
    <h3 className="mt-2 text-xl font-semibold" {...p} />
  ),
  p: (p: ComponentProps<'p'>) => <p className="leading-relaxed" {...p} />,
  ul: (p: ComponentProps<'ul'>) => (
    <ul className="ml-5 list-disc space-y-1" {...p} />
  ),
  ol: (p: ComponentProps<'ol'>) => (
    <ol className="ml-5 list-decimal space-y-1" {...p} />
  ),
  li: (p: ComponentProps<'li'>) => <li className="marker:text-muted" {...p} />,
  a: (p: ComponentProps<'a'>) => (
    <a className="text-accent-2 underline underline-offset-2" {...p} />
  ),
  strong: (p: ComponentProps<'strong'>) => (
    <strong className="font-semibold text-ink" {...p} />
  ),
  code: (p: ComponentProps<'code'>) => (
    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm" {...p} />
  ),
  blockquote: (p: ComponentProps<'blockquote'>) => (
    <blockquote
      className="border-l-2 border-accent pl-4 italic text-muted"
      {...p}
    />
  ),
}
