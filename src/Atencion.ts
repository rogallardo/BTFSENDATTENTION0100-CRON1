import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

export interface IAtencion {
    ID_Consulta: string;
    Estado_Atencion: string;
    Fecha_Atencion: string;
    Hora_Atencion: string;
    Titular_Nombre: string;
    ID_Titular: string;
    Paciente_Nombre: string;
    ID_Paciente: string;
    Celular: string;
    Es_Carga: string;
    Tipo_Consulta: string;
    Rut_Prestador: string;
    Es_Especialista: string;
    Especialidad: string;
    Tipo_Canal_Consulta: string;
    Fecha_Inicio_Consulta: Date;
    Fecha_Termino_Consulta: Date;
    Fecha_Inicio_Llamada: Date;
    Fecha_Termino_Llamada: Date;
    Tpo_Espera: string;
    NPS_satisfaccion_medico: string;
    NPS_recomendacion: string;
    NPS_comentarios: string;
    ID_PLAN: string;
    Pais_Plan: string;
    Periodo: string;
}

@Entity({ name: "PLT_BTF_CSV_OUT_Uso"})
export class Atencion extends BaseEntity implements IAtencion {
    @PrimaryColumn({ type: "char"})
    public ID_Consulta!: string;

    @Column({ type: "varchar", length: 30 })
    public Estado_Atencion!: string;

    @Column({ type: "char", length: 8 })
    public Fecha_Atencion!: string;

    @Column({ type: "char", length: 8 })
    public Hora_Atencion!: string;

    @Column({ type: "varchar", length: 180 })
    public Titular_Nombre!: string;

    @Column({ type: "char", length: 20 })
    public ID_Titular!: string;

    @Column({ type: "varchar", length: 180 })
    public Paciente_Nombre!: string;

    @Column({ type: "char", length: 20 })
    public ID_Paciente!: string;

    @Column({ type: "varchar", length: 60 })
    public Celular!: string;

    @Column({ type: "varchar", length: 5 })
    public Es_Carga!: string;

    @Column({ type: "varchar", length: 10 })
    public Tipo_Consulta!: string;

    @Column({ type: "char", length: 30 })
    public Rut_Prestador!: string;

    @Column({ type: "varchar", length: 5 })
    public Es_Especialista!: string;

    @Column({ type: "varchar", length: 100 })
    public Especialidad!: string;

    @Column({ type: "varchar", length: 20 })
    public Tipo_Canal_Consulta!: string;

    @Column({ type: "datetime" })
    public Fecha_Inicio_Consulta!: Date;

    @Column({ type: "datetime" })
    public Fecha_Termino_Consulta!: Date;

    @Column({ type: "datetime" })
    public Fecha_Inicio_Llamada!: Date;

    @Column({ type: "datetime" })
    public Fecha_Termino_Llamada!: Date;

    @Column({ type: "varchar", length: 30 })
    public Tpo_Espera!: string;

    @Column({ type: "varchar", length: 10 })
    public NPS_satisfaccion_medico!: string;

    @Column({ type: "varchar", length: 10 })
    public NPS_recomendacion!: string;

    @Column({ type: "varchar", length: 4000 })
    public NPS_comentarios!: string;

    @Column({ type: "varchar", length: 50 })
    public ID_PLAN!: string;

    @Column({ type: "char", length: 50 })
    public Pais_Plan!: string;

    @Column({ type: "char", length: 6 })
    public Periodo!: string;
}
