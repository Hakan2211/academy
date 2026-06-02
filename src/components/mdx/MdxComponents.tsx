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
// --- Biology ---
import { MrsGren } from './MrsGren'
import { BioScale } from './BioScale'
import { TreeOfLife } from './TreeOfLife'
import { MicroscopeZoom } from './MicroscopeZoom'
import { VariableLab } from './VariableLab'
import { DichotomousKey } from './DichotomousKey'
import { CellViewer } from './CellViewer'
import { ProkaryoteEukaryote } from './ProkaryoteEukaryote'
import { Endosymbiosis } from './Endosymbiosis'
import { Cytoskeleton } from './Cytoskeleton'
import { FluidMosaic } from './FluidMosaic'
import { DiffusionLab } from './DiffusionLab'
import { OsmosisLab } from './OsmosisLab'
import { SurfaceVolume } from './SurfaceVolume'
import { ActiveTransport } from './ActiveTransport'
import { BulkTransport } from './BulkTransport'
import { BiomoleculeViewer } from './BiomoleculeViewer'
import { CarbonBackbone } from './CarbonBackbone'
import { WaterMolecule } from './WaterMolecule'
import { ProteinFold } from './ProteinFold'
import { ATPCycle } from './ATPCycle'
import { EnzymeLab } from './EnzymeLab'
import { EnzymeRate } from './EnzymeRate'
import { Photosynthesis } from './Photosynthesis'
import { CellularRespiration } from './CellularRespiration'
import { DNAHelix } from './DNAHelix'
import { DNAReplication } from './DNAReplication'
import { CodonWheel } from './CodonWheel'
import { Transcription } from './Transcription'
import { Translation } from './Translation'
import { GeneRegulation } from './GeneRegulation'
import { CellCycle } from './CellCycle'
import { Mitosis } from './Mitosis'
import { Meiosis } from './Meiosis'
import { PunnettSquare } from './PunnettSquare'
import { Karyotype } from './Karyotype'
import { Pedigree } from './Pedigree'
import { NaturalSelection } from './NaturalSelection'
import { EvidenceTabs } from './EvidenceTabs'
import { Speciation } from './Speciation'
import { OriginTimeline } from './OriginTimeline'
import { NutrientGroups } from './NutrientGroups'
import { DigestiveSystem } from './DigestiveSystem'
import { HeartPump } from './HeartPump'
import { GasExchange } from './GasExchange'
import { BloodViewer } from './BloodViewer'
import { Nephron } from './Nephron'
import { NervousSystem } from './NervousSystem'
import { Neuron } from './Neuron'
import { ReflexArc } from './ReflexArc'
import { BrainMap } from './BrainMap'
import { Hormones } from './Hormones'
import { Homeostasis } from './Homeostasis'
import { ActionPotential } from './ActionPotential'
import { ReproductionCompare } from './ReproductionCompare'
import { ReproductiveSystem } from './ReproductiveSystem'
import { Fertilization } from './Fertilization'
import { MenstrualCycle } from './MenstrualCycle'
import { Development } from './Development'
import { LeafStructure } from './LeafStructure'
import { Transpiration } from './Transpiration'
import { PhloemTransport } from './PhloemTransport'
import { PlantNutrition } from './PlantNutrition'
import { FlowerAnatomy } from './FlowerAnatomy'
import { PlantTropism } from './PlantTropism'
import { MicrobeViewer } from './MicrobeViewer'
import { VirusReplication } from './VirusReplication'
import { FungiProtists } from './FungiProtists'
import { DiseaseSpread } from './DiseaseSpread'
import { ImmuneSystem } from './ImmuneSystem'
import { Vaccination } from './Vaccination'
import { ImmuneResponse } from './ImmuneResponse'
import { EnergyPyramid } from './EnergyPyramid'
import { FoodWeb } from './FoodWeb'
import { CarbonCycle } from './CarbonCycle'
import { PopulationGraph } from './PopulationGraph'
import { ClimateGraph } from './ClimateGraph'
// --- Chemistry ---
import { MatterClassifier } from './MatterClassifier'
import { ChangeLab } from './ChangeLab'
import { SeparationLab } from './SeparationLab'
import { DensityColumn } from './DensityColumn'
import { AtomModels } from './AtomModels'
import { ElectronShells } from './ElectronShells'
import { IonFormation } from './IonFormation'
import { ElectronConfig } from './ElectronConfig'
import { PeriodicTable } from './PeriodicTable'
import { IonicBond } from './IonicBond'
import { CovalentBond } from './CovalentBond'
import { MetallicBond } from './MetallicBond'
import { LewisBuilder } from './LewisBuilder'
import { VSEPRViewer } from './VSEPRViewer'
import { Polarity } from './Polarity'
import { FormulaCounter } from './FormulaCounter'
import { MoleConcept } from './MoleConcept'
import { MolarMass } from './MolarMass'
import { EquationBalancer } from './EquationBalancer'
import { StoichRatio } from './StoichRatio'
import { LimitingReactant } from './LimitingReactant'
import { ReactionTypes } from './ReactionTypes'
import { PrecipitationLab } from './PrecipitationLab'
import { ActivitySeries } from './ActivitySeries'
import { GasLawLab } from './GasLawLab'
import { DissolveLab } from './DissolveLab'
import { SolubilityCurve } from './SolubilityCurve'
import { MolarityLab } from './MolarityLab'
import { Colligative } from './Colligative'
import { PHScale } from './PHScale'
import { AcidBaseProperties } from './AcidBaseProperties'
import { Dissociation } from './Dissociation'
import { TitrationLab } from './TitrationLab'
import { EnergyDiagram } from './EnergyDiagram'
import { BondEnergy } from './BondEnergy'
import { Calorimeter } from './Calorimeter'
import { HessLaw } from './HessLaw'
import { CollisionTheory } from './CollisionTheory'
import { RateFactors } from './RateFactors'
import { EquilibriumLab } from './EquilibriumLab'
import { RedoxLab } from './RedoxLab'
import { OxidationTracker } from './OxidationTracker'
import { GalvanicCell } from './GalvanicCell'
import { ElectrolysisCell } from './ElectrolysisCell'
import { HydrocarbonViewer } from './HydrocarbonViewer'
import { IsomerViewer } from './IsomerViewer'
import { FunctionalGroups } from './FunctionalGroups'
import { PolymerBuilder } from './PolymerBuilder'
import { CarbohydrateViewer } from './CarbohydrateViewer'
import { LipidViewer } from './LipidViewer'
// --- Math ---
import { NumberLine } from './NumberLine'
import { PlaceValue } from './PlaceValue'
import { OperationOrder } from './OperationOrder'
import { RoundingLine } from './RoundingLine'
import { NumberSystems } from './NumberSystems'
import { PrimeSieve } from './PrimeSieve'
import { FactorPairs } from './FactorPairs'
import { FactorTree } from './FactorTree'
import { HcfLcm } from './HcfLcm'
import { SquareDots } from './SquareDots'
import { FractionBar } from './FractionBar'
import { FractionCompare } from './FractionCompare'
import { FractionAdd } from './FractionAdd'
import { FractionMultiply } from './FractionMultiply'
import { PercentGrid } from './PercentGrid'
import { PercentChange } from './PercentChange'
import { RecurringDecimal } from './RecurringDecimal'
import { RatioMixer } from './RatioMixer'
import { InverseProportion } from './InverseProportion'
import { ScaleModel } from './ScaleModel'
import { UnitaryMethod } from './UnitaryMethod'
import { PowerExplorer } from './PowerExplorer'
import { IndexLaws } from './IndexLaws'
import { SurdSimplify } from './SurdSimplify'
import { StandardForm } from './StandardForm'
import { AlgebraTiles } from './AlgebraTiles'
import { ExpandBrackets } from './ExpandBrackets'
import { SubstitutionMachine } from './SubstitutionMachine'
import { RearrangeFormula } from './RearrangeFormula'
import { BalanceScale } from './BalanceScale'
import { EquationSolver } from './EquationSolver'
import { SimultaneousGraph } from './SimultaneousGraph'
import { InequalityLine } from './InequalityLine'
import { DoubleBrackets } from './DoubleBrackets'
import { FactoriseQuadratic } from './FactoriseQuadratic'
import { DiffOfSquares } from './DiffOfSquares'
import { CompleteSquare } from './CompleteSquare'
import { QuadraticFormula } from './QuadraticFormula'
import { ParabolaExplorer } from './ParabolaExplorer'
import { CoordinatePlane } from './CoordinatePlane'
import { LinearGraph } from './LinearGraph'
import { PerpendicularLines } from './PerpendicularLines'
import { MidpointDistance } from './MidpointDistance'
import { FunctionGallery } from './FunctionGallery'
import { SequenceExplorer } from './SequenceExplorer'
import { NthTermFinder } from './NthTermFinder'
import { GeometricSequence } from './GeometricSequence'
import { FigurateNumbers } from './FigurateNumbers'
import { FibonacciSpiral } from './FibonacciSpiral'
import { AngleExplorer } from './AngleExplorer'
import { ParallelAngles } from './ParallelAngles'
import { TriangleAngles } from './TriangleAngles'
import { PolygonAngles } from './PolygonAngles'
import { CircleParts } from './CircleParts'
import { SymmetryExplorer } from './SymmetryExplorer'
import { UnitConverter } from './UnitConverter'
import { AreaPerimeter } from './AreaPerimeter'
import { CircleArea } from './CircleArea'
import { SurfaceArea } from './SurfaceArea'
import { VolumePrism } from './VolumePrism'
import { VolumeSolids } from './VolumeSolids'
import { TransformGrid } from './TransformGrid'
import { VectorAdd } from './VectorAdd'
import { CongruenceSimilarity } from './CongruenceSimilarity'
import { LociViewer } from './LociViewer'
import { CircleTheorems } from './CircleTheorems'
import { PythagorasViz } from './PythagorasViz'
import { TrigRatios } from './TrigRatios'
import { UnitCircle } from './UnitCircle'
import { SineRule } from './SineRule'
import { CosineRule } from './CosineRule'
import { ProbabilityScale } from './ProbabilityScale'
import { DiceSpinner } from './DiceSpinner'
import { SampleSpace } from './SampleSpace'
import { ProbabilityTree } from './ProbabilityTree'
import { VennDiagram } from './VennDiagram'
import { SamplingViz } from './SamplingViz'
import { BarPieChart } from './BarPieChart'
import { AveragesViz } from './AveragesViz'
import { Histogram } from './Histogram'
import { StandardDeviation } from './StandardDeviation'
import { BoxPlot } from './BoxPlot'
import { ScatterPlot } from './ScatterPlot'
import { MisleadingGraph } from './MisleadingGraph'
import { LimitViz } from './LimitViz'
import { DerivativeExplorer } from './DerivativeExplorer'
import { AreaUnderCurve } from './AreaUnderCurve'
import { ProofWithoutWords } from './ProofWithoutWords'
import { InfinityMatch } from './InfinityMatch'
import { FractalViewer } from './FractalViewer'
import { UnsolvedProblems } from './UnsolvedProblems'
// --- Computer Science ---
import { ComputerModel } from './ComputerModel'
import { HistoryTimeline } from './HistoryTimeline'
import { ComputationalThinking } from './ComputationalThinking'
import { AbstractionLayers } from './AbstractionLayers'
import { BitSwitch } from './BitSwitch'
import { BinaryConverter } from './BinaryConverter'
import { AsciiExplorer } from './AsciiExplorer'
import { IntegerStore } from './IntegerStore'
import { PixelGrid } from './PixelGrid'
import { ColorMixer } from './ColorMixer'
import { SamplingLab } from './SamplingLab'
import { CompressionLab } from './CompressionLab'
import { ParityCheck } from './ParityCheck'
import { BooleanLogicLab } from './BooleanLogicLab'
import { TruthTable } from './TruthTable'
import { LogicGate } from './LogicGate'
import { GateCircuit } from './GateCircuit'
import { BinaryAdder } from './BinaryAdder'
import { ComputerAnatomy } from './ComputerAnatomy'
import { CpuDiagram } from './CpuDiagram'
import { MemoryHierarchy } from './MemoryHierarchy'
import { MachineCode } from './MachineCode'
import { FetchExecute } from './FetchExecute'
import { IoDevices } from './IoDevices'
import { AlgorithmFlow } from './AlgorithmFlow'
import { LoopTracer } from './LoopTracer'
import { SearchVisualizer } from './SearchVisualizer'
import { SortVisualizer } from './SortVisualizer'
import { RecursionTree } from './RecursionTree'
import { BigOChart } from './BigOChart'
import { ArrayViz } from './ArrayViz'
import { StackQueue } from './StackQueue'
import { LinkedList } from './LinkedList'
import { TreeViz } from './TreeViz'
import { GraphViz } from './GraphViz'
import { HashTable } from './HashTable'
import { CodeStepper } from './CodeStepper'
import { VariableBox } from './VariableBox'
import { ControlFlowViz } from './ControlFlowViz'
import { CallStack } from './CallStack'
import { OopViz } from './OopViz'
import { CompilerPipeline } from './CompilerPipeline'
import { SdlcCycle } from './SdlcCycle'
import { ModularityViz } from './ModularityViz'
import { TestSuite } from './TestSuite'
import { VersionGraph } from './VersionGraph'
import { OsServices } from './OsServices'
import { ProcessStates } from './ProcessStates'
import { Scheduler } from './Scheduler'
import { MemoryPaging } from './MemoryPaging'
import { DeadlockViz } from './DeadlockViz'
import { NetworkTopology } from './NetworkTopology'
import { PacketJourney } from './PacketJourney'
import { ProtocolStack } from './ProtocolStack'
import { DnsLookup } from './DnsLookup'
import { ClientServer } from './ClientServer'
import { WebRequest } from './WebRequest'
import { DomTree } from './DomTree'
import { BoxModel } from './BoxModel'
import { JsInteractive } from './JsInteractive'
import { FrontBackEnd } from './FrontBackEnd'
import { DatabaseTable } from './DatabaseTable'
import { SqlQuery } from './SqlQuery'
import { ErDiagram } from './ErDiagram'
import { JoinViz } from './JoinViz'
import { NormalizationViz } from './NormalizationViz'
import { ThreatGallery } from './ThreatGallery'
import { CaesarCipher } from './CaesarCipher'
import { SymmetricCrypto } from './SymmetricCrypto'
import { PublicKeyExchange } from './PublicKeyExchange'
import { HashViz } from './HashViz'
import { PasswordStrength } from './PasswordStrength'
import { RasterCanvas } from './RasterCanvas'
import { Transform2D } from './Transform2D'
import { WireframeMesh } from './WireframeMesh'
import { ShadingLab } from './ShadingLab'
import { AnimationTimeline } from './AnimationTimeline'
import { AiSearch } from './AiSearch'
import { MlClassifier } from './MlClassifier'
import { Perceptron } from './Perceptron'
import { NeuralNet } from './NeuralNet'
import { TokenPredictor } from './TokenPredictor'
import { RobotPerception } from './RobotPerception'
import { StateMachine } from './StateMachine'
import { TuringMachine } from './TuringMachine'
import { HaltingProblem } from './HaltingProblem'
import { ComplexityClasses } from './ComplexityClasses'
import { DecidabilityMap } from './DecidabilityMap'

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

  // Biology
  MrsGren,
  BioScale,
  TreeOfLife,
  MicroscopeZoom,
  VariableLab,
  DichotomousKey,
  CellViewer,
  ProkaryoteEukaryote,
  Endosymbiosis,
  Cytoskeleton,
  FluidMosaic,
  DiffusionLab,
  OsmosisLab,
  SurfaceVolume,
  ActiveTransport,
  BulkTransport,
  BiomoleculeViewer,
  CarbonBackbone,
  WaterMolecule,
  ProteinFold,
  ATPCycle,
  EnzymeLab,
  EnzymeRate,
  Photosynthesis,
  CellularRespiration,
  DNAHelix,
  DNAReplication,
  CodonWheel,
  Transcription,
  Translation,
  GeneRegulation,
  CellCycle,
  Mitosis,
  Meiosis,
  PunnettSquare,
  Karyotype,
  Pedigree,
  NaturalSelection,
  EvidenceTabs,
  Speciation,
  OriginTimeline,
  NutrientGroups,
  DigestiveSystem,
  HeartPump,
  GasExchange,
  BloodViewer,
  Nephron,
  NervousSystem,
  Neuron,
  ReflexArc,
  BrainMap,
  Hormones,
  Homeostasis,
  ActionPotential,
  ReproductionCompare,
  ReproductiveSystem,
  Fertilization,
  MenstrualCycle,
  Development,
  LeafStructure,
  Transpiration,
  PhloemTransport,
  PlantNutrition,
  FlowerAnatomy,
  PlantTropism,
  MicrobeViewer,
  VirusReplication,
  FungiProtists,
  DiseaseSpread,
  ImmuneSystem,
  Vaccination,
  ImmuneResponse,
  EnergyPyramid,
  FoodWeb,
  CarbonCycle,
  PopulationGraph,
  ClimateGraph,

  // Chemistry
  MatterClassifier,
  ChangeLab,
  SeparationLab,
  DensityColumn,
  AtomModels,
  ElectronShells,
  IonFormation,
  ElectronConfig,
  PeriodicTable,
  IonicBond,
  CovalentBond,
  MetallicBond,
  LewisBuilder,
  VSEPRViewer,
  Polarity,
  FormulaCounter,
  MoleConcept,
  MolarMass,
  EquationBalancer,
  StoichRatio,
  LimitingReactant,
  ReactionTypes,
  PrecipitationLab,
  ActivitySeries,
  GasLawLab,
  DissolveLab,
  SolubilityCurve,
  MolarityLab,
  Colligative,
  PHScale,
  AcidBaseProperties,
  Dissociation,
  TitrationLab,
  EnergyDiagram,
  BondEnergy,
  Calorimeter,
  HessLaw,
  CollisionTheory,
  RateFactors,
  EquilibriumLab,
  RedoxLab,
  OxidationTracker,
  GalvanicCell,
  ElectrolysisCell,
  HydrocarbonViewer,
  IsomerViewer,
  FunctionalGroups,
  PolymerBuilder,
  CarbohydrateViewer,
  LipidViewer,

  // Math
  NumberLine,
  PlaceValue,
  OperationOrder,
  RoundingLine,
  NumberSystems,
  PrimeSieve,
  FactorPairs,
  FactorTree,
  HcfLcm,
  SquareDots,
  FractionBar,
  FractionCompare,
  FractionAdd,
  FractionMultiply,
  PercentGrid,
  PercentChange,
  RecurringDecimal,
  RatioMixer,
  InverseProportion,
  ScaleModel,
  UnitaryMethod,
  PowerExplorer,
  IndexLaws,
  SurdSimplify,
  StandardForm,
  AlgebraTiles,
  ExpandBrackets,
  SubstitutionMachine,
  RearrangeFormula,
  BalanceScale,
  EquationSolver,
  SimultaneousGraph,
  InequalityLine,
  DoubleBrackets,
  FactoriseQuadratic,
  DiffOfSquares,
  CompleteSquare,
  QuadraticFormula,
  ParabolaExplorer,
  CoordinatePlane,
  LinearGraph,
  PerpendicularLines,
  MidpointDistance,
  FunctionGallery,
  SequenceExplorer,
  NthTermFinder,
  GeometricSequence,
  FigurateNumbers,
  FibonacciSpiral,
  AngleExplorer,
  ParallelAngles,
  TriangleAngles,
  PolygonAngles,
  CircleParts,
  SymmetryExplorer,
  UnitConverter,
  AreaPerimeter,
  CircleArea,
  SurfaceArea,
  VolumePrism,
  VolumeSolids,
  TransformGrid,
  VectorAdd,
  CongruenceSimilarity,
  LociViewer,
  CircleTheorems,
  PythagorasViz,
  TrigRatios,
  UnitCircle,
  SineRule,
  CosineRule,
  ProbabilityScale,
  DiceSpinner,
  SampleSpace,
  ProbabilityTree,
  VennDiagram,
  SamplingViz,
  BarPieChart,
  AveragesViz,
  Histogram,
  StandardDeviation,
  BoxPlot,
  ScatterPlot,
  MisleadingGraph,
  LimitViz,
  DerivativeExplorer,
  AreaUnderCurve,
  ProofWithoutWords,
  InfinityMatch,
  FractalViewer,
  UnsolvedProblems,

  // Computer Science
  ComputerModel,
  HistoryTimeline,
  ComputationalThinking,
  AbstractionLayers,
  BitSwitch,
  BinaryConverter,
  AsciiExplorer,
  IntegerStore,
  PixelGrid,
  ColorMixer,
  SamplingLab,
  CompressionLab,
  ParityCheck,
  BooleanLogicLab,
  TruthTable,
  LogicGate,
  GateCircuit,
  BinaryAdder,
  ComputerAnatomy,
  CpuDiagram,
  MemoryHierarchy,
  MachineCode,
  FetchExecute,
  IoDevices,
  AlgorithmFlow,
  LoopTracer,
  SearchVisualizer,
  SortVisualizer,
  RecursionTree,
  BigOChart,
  ArrayViz,
  StackQueue,
  LinkedList,
  TreeViz,
  GraphViz,
  HashTable,
  CodeStepper,
  VariableBox,
  ControlFlowViz,
  CallStack,
  OopViz,
  CompilerPipeline,
  SdlcCycle,
  ModularityViz,
  TestSuite,
  VersionGraph,
  OsServices,
  ProcessStates,
  Scheduler,
  MemoryPaging,
  DeadlockViz,
  NetworkTopology,
  PacketJourney,
  ProtocolStack,
  DnsLookup,
  ClientServer,
  WebRequest,
  DomTree,
  BoxModel,
  JsInteractive,
  FrontBackEnd,
  DatabaseTable,
  SqlQuery,
  ErDiagram,
  JoinViz,
  NormalizationViz,
  ThreatGallery,
  CaesarCipher,
  SymmetricCrypto,
  PublicKeyExchange,
  HashViz,
  PasswordStrength,
  RasterCanvas,
  Transform2D,
  WireframeMesh,
  ShadingLab,
  AnimationTimeline,
  AiSearch,
  MlClassifier,
  Perceptron,
  NeuralNet,
  TokenPredictor,
  RobotPerception,
  StateMachine,
  TuringMachine,
  HaltingProblem,
  ComplexityClasses,
  DecidabilityMap,

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
